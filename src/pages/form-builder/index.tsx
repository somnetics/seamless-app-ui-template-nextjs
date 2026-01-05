import React, { JSX, useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDraggable,
  useDroppable,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// import { DragOverlay } from '@dnd-kit/core';

import { cva } from "class-variance-authority";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";

export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date'

export interface FieldItem {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];
}

interface SortableItemProps {
  id: string;
  item: FieldItem;
  isOverlay?: boolean;
  onSelect: (id: string) => void;
}

// const id = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`

const FIELD_TEMPLATES: Record<FieldType, () => FieldItem> = {
  text: () => ({ id: "text-1", type: 'text', label: 'Text Input', placeholder: 'Enter text' }),
  textarea: () => ({ id: "textarea-1", type: 'textarea', label: 'Paragraph', placeholder: 'Enter longer text' }),
  select: () => ({ id: "select-1", type: 'select', label: 'Select', options: ['Option 1', 'Option 2'] }),
  checkbox: () => ({ id: "chekbox-1", type: 'checkbox', label: 'Checkbox' }),
  radio: () => ({ id: "radio-1", type: 'radio', label: 'Radio', options: ['A', 'B'] }),
  date: () => ({ id: "date-1", type: 'date', label: 'Date' }),
}

function SortableItem({ id, item, isOverlay, onSelect }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const variants = cva("bg-white border rounded p-3 mb-3 shadow-sm flex justify-between items-start", {
    variants: {
      dragging: {
        over: "outline-2- outline-dashed- outline-gray-500- opacity-30",
        overlay: "outline-2- outline-dashed- outline-gray-500-",
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}      
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

interface ToolboxItemProps {
  fieldType: FieldType,
  isOverlay?: boolean;
  onAdd: (type: FieldType) => void
}

function ToolboxItem({ fieldType, isOverlay, onAdd }: ToolboxItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tool-${fieldType}`,
    data: { source: 'toolbox', fieldType },
  });

  const style: React.CSSProperties = {
    transform: transform
      ? CSS.Transform.toString({
        ...transform,
        scaleX: 1,
        scaleY: 1,
      })
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
  };

  const variants = cva("w-full p-2 border rounded text-left cursor-pointer bg-white hover:bg-gray-50", {
    variants: {
      dragging: {
        over: "outline-2- outline-dashed- outline-red-500- opacity-30",
        overlay: "outline-2- outline-dashed- outline-red-500-",
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      // {...attributes}
      {...listeners}
      onClick={() => onAdd(fieldType)}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })} 
    >
      {fieldType}
    </div>
  )
}

function useCanvasDroppable(id: string) {
  const { isOver, setNodeRef } = useDroppable({ id: id })
  return { isOver, setNodeRef }
}

export default function FormBuilder(): JSX.Element {
  const [fields, setFields] = useState<FieldItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<FieldType | null>(null);

  // const sensors = useSensors(useSensor(PointerSensor))
  // const sensors = useSensors(
  //   useSensor(MouseSensor, {
  //     activationConstraint: {
  //       distance: 6,
  //     },
  //   }),
  //   useSensor(TouchSensor, {
  //     activationConstraint: {
  //       distance: 10,
  //     },
  //   })
  // );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  useEffect(() => {
    // const saved = localStorage.getItem('fb_saved')
    // if (saved) setFields(JSON.parse(saved))
  }, [])

  useEffect(() => {
    // localStorage.setItem('fb_saved', JSON.stringify(fields))
  }, [fields])

  function addField(type: FieldType, atIndex?: number) {
    const newField = FIELD_TEMPLATES[type]()
    newField.id = `${type}_${Math.random().toString(36).slice(2, 9)}`

    setFields((s) => {
      if (typeof atIndex === 'number') {
        const copy = [...s]
        copy.splice(atIndex, 0, newField)
        return copy
      }
      return [...s, newField]
    })
    setSelectedId(newField.id)
  }

  function updateField(fieldId: string, patch: Partial<FieldItem>) {
    setFields((items) => items.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)))
  }

  function removeField(fieldId: string) {
    setFields((items) => items.filter((f) => f.id !== fieldId))
    if (selectedId === fieldId) setSelectedId(null)
  }

  // function onDragEnd(event: DragEndEvent) {
  //   const { active, over } = event
  //   const source = active.data?.current?.source as string | undefined
  //   const fieldType = active.data?.current?.fieldType as FieldType | undefined

  //   if (source === 'toolbox' && fieldType) {
  //     if (over && over.id && over.id !== 'canvas') {
  //       const insertIndex = fields.findIndex((f) => f.id === over.id)
  //       const clamped = insertIndex === -1 ? fields.length : insertIndex
  //       // addField(fieldType, clamped)
  //       // return
  //     }
  //     addField(fieldType)
  //     return
  //   }

  //   if (over && active.id !== over.id) {
  //     const oldIndex = fields.findIndex((f) => f.id === active.id)
  //     const newIndex = fields.findIndex((f) => f.id === over.id)
  //     if (oldIndex !== -1 && newIndex !== -1) setFields((items) => arrayMove(items, oldIndex, newIndex))
  //   }
  // }

  function onDragStart(event: DragStartEvent) {
    // if (!hasDraggableData(event.active)) return;

    // const data = event.active.data.current;
    // console.log(data)


    const type = event.active.data?.current?.fieldType as FieldType | undefined;
    if (type) setActiveTool(type);

    // if (data?.type === "Column") {
    //   setActiveColumn(data.column);
    //   return;
    // }

    // if (data?.type === "Task") {
    //   setActiveTask(data.task);
    //   return;
    // }
  }

  function onDragOver(event: DragOverEvent) {
    // if (!hasDraggableData(event.active)) return;
    const { active, over } = event;


    console.log(active, over)
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // if (data?.type === "Column") {
    //   setActiveColumn(data.column);
    //   return;
    // }

    // if (data?.type === "Task") {
    //   setActiveTask(data.task);
    //   return;
    // }
  }

  const clearActive = () => setActiveTool(null);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // console.log(over)

    const source = active.data?.current?.source as string | undefined
    const fieldType = active.data?.current?.fieldType as FieldType | undefined

    clearActive()

    if (source === 'toolbox' && fieldType) {
      // Only add if dropped inside canvas
      if (over) {
        // console.log(over);
        // console.log(active);
        const insertIndex = fields.findIndex((f) => f.id === over.id)
        // console.log(insertIndex, fields.length)
        const clamped = insertIndex === -1 ? fields.length : insertIndex
        // const clamped = insertIndex + 1
        // console.log(clamped)
        addField(fieldType, clamped);
        return;
      } else {
        addField(fieldType);
        return;
      }
    }

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id)
      const newIndex = fields.findIndex((f) => f.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) setFields((items) => arrayMove(items, oldIndex, newIndex))
    }
  };

  const selectedField = fields.find((f) => f.id === selectedId) || null
  const { isOver, setNodeRef } = useCanvasDroppable('canvas')

  // IMPORTANT: The DndContext must wrap both the toolbox and the canvas so toolbox draggables are recognized.
  // Move DndContext to wrap the overall grid (toolbox + canvas + inspector).
  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            <aside className="col-span-3">
              <div className="sticky- top-6- space-y-4">
                <div className="bg-white rounded shadow p-4">
                  <h3 className="font-semibold mb-2">Toolbox</h3>
                  <div className="grid gap-2">
                    {(['text', 'textarea', 'select', 'checkbox', 'radio', 'date'] as FieldType[]).map((t) => (
                      <ToolboxItem key={t} fieldType={t} onAdd={addField} isOverlay />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Drag or click to add a field.</div>
                </div>
              </div>
            </aside>

            <main className="col-span-6">
              <div
                ref={setNodeRef}
                id="canvas"
                className={`bg-white rounded shadow p-4 min-h-[60vh] transition-border ${isOver ? 'ring-2 ring-blue-300' : ''}`}
              >
                <h2 className="font-semibold mb-4">Form Canvas</h2>
                <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <div>
                    {fields.length === 0 && (
                      <div className="text-gray-400">No fields yet — drag or click from the toolbox.</div>
                    )}
                    {fields.map((f) => (
                      <SortableItem key={f.id} id={f.id} item={f} onSelect={(id) => setSelectedId(id)} isOverlay />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </main>

            <aside className="col-span-3">
              <div className="sticky- top-6- bg-white rounded shadow p-4">
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
                          value={(selectedField.options || []).join('')}
                          onChange={(e) => updateField(selectedField.id, { options: e.target.value.split('') })}
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
          </div>
        </div>
      </DndContext>

      <div className="col-span-12">
        <div className="bg-white rounded shadow p-4 mt-4">
          <h3 className="font-semibold mb-2">Form JSON</h3>
          <pre className="text-xs max-h-60 overflow-auto bg-gray-100 p-3 rounded">{JSON.stringify(fields, null, 2)}</pre>
        </div>
      </div>
    </>
  )
}
