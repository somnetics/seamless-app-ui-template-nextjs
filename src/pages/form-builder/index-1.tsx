import React, { useState, useEffect, JSX } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ---- Types ---- //
export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date'

export interface FieldItem {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  options?: string[]
}

interface SortableItemProps {
  id: string
  item: FieldItem
  onSelect: (id: string) => void
}

// Simple sortable item using dnd-kit
function SortableItem({ id, item, onSelect }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded p-3 mb-3 shadow-sm flex justify-between items-start"
    >
      <div className="flex-1">
        <div className="font-medium">{item.label || item.type}</div>
        <div className="text-xs text-gray-500">{item.type}</div>
      </div>

      <div className="flex gap-2 items-center">
        <button
          {...attributes}
          {...listeners}
          className="px-2 py-1 border rounded text-sm bg-gray-100"
          title="Drag to reorder"
        >
          ☰
        </button>
        <button
          onClick={() => onSelect(item.id)}
          className="px-2 py-1 border rounded text-sm bg-blue-50"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

// Small helper to generate IDs
const id = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`

// Default field templates
const FIELD_TEMPLATES: Record<FieldType, () => FieldItem> = {
  text: () => ({ id: id('field'), type: 'text', label: 'Text Input', placeholder: 'Enter text' }),
  textarea: () => ({ id: id('field'), type: 'textarea', label: 'Paragraph', placeholder: 'Enter longer text' }),
  select: () => ({ id: id('field'), type: 'select', label: 'Select', options: ['Option 1', 'Option 2'] }),
  checkbox: () => ({ id: id('field'), type: 'checkbox', label: 'Checkbox' }),
  radio: () => ({ id: id('field'), type: 'radio', label: 'Radio', options: ['A', 'B'] }),
  date: () => ({ id: id('field'), type: 'date', label: 'Date' }),
}

export default function FormBuilder(): JSX.Element {
  const [fields, setFields] = useState<FieldItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    const saved = localStorage.getItem('fb_saved')
    if (saved) setFields(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('fb_saved', JSON.stringify(fields))
  }, [fields])

  function addField(type: FieldType) {
    const newField = FIELD_TEMPLATES[type]()
    setFields((s) => [...s, newField])
    setSelectedId(newField.id)
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id)
      const newIndex = fields.findIndex((f) => f.id === over.id)
      setFields((items) => arrayMove(items, oldIndex, newIndex))
    }
  }

  function updateField(fieldId: string, patch: Partial<FieldItem>) {
    setFields((items) => items.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)))
  }

  function removeField(fieldId: string) {
    setFields((items) => items.filter((f) => f.id !== fieldId))
    if (selectedId === fieldId) setSelectedId(null)
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(fields, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'form.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function loadJSON(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        if (Array.isArray(parsed)) setFields(parsed)
      } catch (err) {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(f)
  }

  const selectedField = fields.find((f) => f.id === selectedId) || null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Toolbox */}
        <aside className="col-span-3">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Toolbox</h3>
              <div className="grid gap-2">
                {(['text', 'textarea', 'select', 'checkbox', 'radio', 'date'] as FieldType[]).map((t) => (
                  <button key={t} onClick={() => addField(t)} className="w-full p-2 border rounded text-left capitalize text-black">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Actions</h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => setFields([])} className="p-2 border rounded">Clear</button>
                <button onClick={() => setJsonPreviewOpen((s) => !s)} className="p-2 border rounded">Toggle JSON Preview</button>
                <button onClick={exportJSON} className="p-2 border rounded">Export JSON</button>
                <label className="p-2 border rounded cursor-pointer text-center">
                  Load JSON
                  <input onChange={loadJSON} type="file" accept="application/json" className="hidden" />
                </label>
              </div>
            </div>

            <div className="text-xs text-gray-500">Tip: click a toolbox item to add it. Drag list items to reorder. Use Edit to change field properties.</div>
          </div>
        </aside>

        {/* Canvas */}
        <main className="col-span-6">
          <div className="bg-white rounded shadow p-4 min-h-[60vh]">
            <h2 className="font-semibold mb-4">Form Canvas</h2>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div>
                  {fields.length === 0 && (
                    <div className="text-gray-400">No fields yet — use the toolbox to add some.</div>
                  )}

                  {fields.map((f) => (
                    <SortableItem key={f.id} id={f.id} item={f} onSelect={(id) => setSelectedId(id)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Preview */}
          <div className="mt-4 bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Live Preview</h3>
            <FormPreview fields={fields} />
          </div>
        </main>

        {/* Inspector */}
        <aside className="col-span-3">
          <div className="sticky top-6 bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Inspector</h3>
            {selectedField ? (
              <div>
                <div className="mb-2 text-sm text-gray-600">Editing: {selectedField.type}</div>
                <label className="block text-xs">Label</label>
                <input
                  value={selectedField.label || ''}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className="w-full border rounded p-2 mb-2"
                />

                {['text', 'textarea', 'select'].includes(selectedField.type) && (
                  <>
                    <label className="block text-xs">Placeholder</label>
                    <input
                      value={selectedField.placeholder || ''}
                      onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                      className="w-full border rounded p-2 mb-2"
                    />
                  </>
                )}

                {['select', 'radio'].includes(selectedField.type) && (
                  <>
                    <label className="block text-xs">Options (one per line)</label>
                    <textarea
                      value={(selectedField.options || []).join('\n')}
                      onChange={(e) => updateField(selectedField.id, { options: e.target.value.split('\n') })}
                      className="w-full border rounded p-2 mb-2"
                    />
                  </>
                )}

                <div className="flex gap-2">
                  <button onClick={() => removeField(selectedField.id)} className="p-2 border rounded text-sm flex-1">Delete</button>
                  <button onClick={() => setSelectedId(null)} className="p-2 border rounded text-sm flex-1">Close</button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Select a field to edit its properties.</div>
            )}
          </div>
        </aside>

        {jsonPreviewOpen && (
          <div className="col-span-12">
            <div className="bg-white rounded shadow p-4 mt-4">
              <h3 className="font-semibold mb-2">Form JSON</h3>
              <pre className="text-xs max-h-60 overflow-auto bg-gray-100 p-3 rounded">{JSON.stringify(fields, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface FormPreviewProps {
  fields: FieldItem[]
}

function FormPreview({ fields }: FormPreviewProps): JSX.Element {
  return (
    <form className="space-y-3">
      {fields.map((f) => (
        <div key={f.id}>
          <label className="block text-sm font-medium mb-1">{f.label}</label>
          {f.type === 'text' && <input placeholder={f.placeholder} className="w-full border rounded p-2" />}
          {f.type === 'textarea' && <textarea placeholder={f.placeholder} className="w-full border rounded p-2" />}
          {f.type === 'select' && (
            <select className="w-full border rounded p-2">
              {(f.options || []).map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
          )}
          {f.type === 'checkbox' && (
            <div className="flex items-center gap-2">
              <input type="checkbox" />
              <span>{f.label}</span>
            </div>
          )}
          {f.type === 'radio' && (
            <div className="flex flex-col">
              {(f.options || []).map((o, i) => (
                <label key={i} className="flex items-center gap-2"><input type="radio" name={f.id} />{o}</label>
              ))}
            </div>
          )}
          {f.type === 'date' && <input type="date" className="w-full border rounded p-2" />}
        </div>
      ))}

      {fields.length > 0 && <button className="px-4 py-2 bg-blue-600 text-white rounded">Submit (demo)</button>}
    </form>
  )
}