import { useRef, useState } from "react";
import { useImmer } from "use-immer";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Announcements from "@/components/FomBuilder/announcements";
import Canvas, { Field } from "@/components/FomBuilder/canvas";
import Sidebar, { SidebarField } from "@/components/FomBuilder/sidebar";

// In your JS/TS entry point:
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

import { Copyright, Heart } from "lucide-react";

function getData(prop: any) {
  return prop?.data?.current ?? {};
}

function createSpacer({ id }: any) {
  return {
    id,
    type: "spacer",
    title: "spacer",
  };
}

export default function App() {
  const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
    1
  );
  const spacerInsertedRef = useRef<any>(null);
  const currentDragFieldRef = useRef<any>(null);
  const [activeSidebarField, setActiveSidebarField] = useState<any>(); // only for fields from the sidebar
  const [activeField, setActiveField] = useState<any>(); // only for fields that are in the form.
  const [data, updateData] = useImmer({
    fields: [],
  });

  const cleanUp = () => {
    setActiveSidebarField(null);
    setActiveField(null);
    currentDragFieldRef.current = null;
    spacerInsertedRef.current = false;
  };

  const handleDragStart = (e: any) => {
    const { active } = e;
    const activeData = getData(active);

    // This is where the cloning starts.
    // We set up a ref to the field we're dragging
    // from the sidebar so that we can finish the clone
    // in the onDragEnd handler.
    if (activeData.fromSidebar) {
      const { field } = activeData;
      const { type } = field;
      setActiveSidebarField(field);
      // Create a new field that'll be added to the fields array
      // if we drag it over the canvas.
      currentDragFieldRef.current = {
        id: active.id,
        type,
        name: `${type}${fields.length + 1}`,
        parent: null,
      };
      return;
    }

    // We aren't creating a new element so go ahead and just insert the spacer
    // since this field already belongs to the canvas.
    const { field, index } = activeData;

    setActiveField(field);
    currentDragFieldRef.current = field;
    updateData((draft: any) => {
      draft.fields.splice(index, 1, createSpacer({ id: active.id }));
    });
  };

  const handleDragOver = (e: any) => {
    const { active, over } = e;
    const activeData = getData(active);

    // Once we detect that a sidebar field is being moved over the canvas
    // we create the spacer using the sidebar fields id with a spacer suffix and add into the
    // fields array so that it'll be rendered on the canvas.

    // 🐑 CLONING 🐑
    // This is where the clone occurs. We're taking the id that was assigned to
    // sidebar field and reusing it for the spacer that we insert to the canvas.
    if (activeData.fromSidebar) {
      const overData = getData(over);

      if (!spacerInsertedRef.current) {
        const spacer = createSpacer({
          id: active.id + "-spacer",
        });

        updateData((draft: any) => {
          if (!draft.fields.length) {
            draft.fields.push(spacer);
          } else {
            const nextIndex =
              overData.index > -1 ? overData.index : draft.fields.length;

            draft.fields.splice(nextIndex, 0, spacer);
          }
          spacerInsertedRef.current = true;
        });
      } else if (!over) {
        // This solves the issue where you could have a spacer handing out in the canvas if you drug
        // a sidebar item on and then off
        updateData((draft: any) => {
          draft.fields = draft.fields.filter((f: any) => f.type !== "spacer");
        });
        spacerInsertedRef.current = false;
      } else {
        // Since we're still technically dragging the sidebar draggable and not one of the sortable draggables
        // we need to make sure we're updating the spacer position to reflect where our drop will occur.
        // We find the spacer and then swap it with the over skipping the op if the two indexes are the same
        updateData((draft: any) => {
          const spacerIndex = draft.fields.findIndex(
            (f: any) => f.id === active.id + "-spacer"
          );

          const nextIndex =
            overData.index > -1 ? overData.index : draft.fields.length - 1;

          if (nextIndex === spacerIndex) {
            return;
          }

          draft.fields = arrayMove(draft.fields, spacerIndex, overData.index);
        });
      }
    }
  };

  const handleDragEnd = (e: any) => {
    const { over } = e;

    // We dropped outside of the over so clean up so we can start fresh.
    if (!over) {
      cleanUp();
      updateData((draft: any) => {
        draft.fields = draft.fields.filter((f: any) => f.type !== "spacer");
      });
      return;
    }

    // This is where we commit the clone.
    // We take the field from the this ref and replace the spacer we inserted.
    // Since the ref just holds a reference to a field that the context is aware of
    // we just swap out the spacer with the referenced field.
    let nextField = currentDragFieldRef.current;

    if (nextField) {
      const overData = getData(over);

      updateData((draft: any) => {
        const spacerIndex = draft.fields.findIndex((f: any) => f.type === "spacer");
        draft.fields.splice(spacerIndex, 1, nextField);

        draft.fields = arrayMove(
          draft.fields,
          spacerIndex,
          overData.index || 0
        );
      });
    }

    setSidebarFieldsRegenKey(Date.now());
    cleanUp();
  };

  const { fields } = data;
  // console.log(JSON.stringify(fields));

  const state = {
    width: 200,
    height: 200,
  };

  // const onResize = (event, { node, size, handle }) => {
  //   this.setState({ width: size.width, height: size.height });
  // };

  // const [width, setWidth] = useState(300)

  const CustomHandle = ({ handleAxis }: { handleAxis: string }) => {
    if (handleAxis === 'e' || handleAxis === 'w') {
      return (
        <span
          className={`custom-handle custom-handle-${handleAxis}`}
          onClick={(e) => e.stopPropagation()}
        />
      )
    }
    return null
  }

  return (
    <div className="app">
      <ResizableBox
        style={{ backgroundColor: "#ff0" }}
        width={200}
        height={200}
        draggableOpts={{ grid: [133.906, 133.906] }}
        // minConstraints={[100, 100]}
        // maxConstraints={[300, 300]}
        axis="x"
        resizeHandles={['e', 'w']}
        // onResizeStop={(e, { size }) => setWidth(size.width)} 
        // handle={(axis) => <CustomHandle handleAxis={axis} />}
        handle={(axis) => <span className={`custom-handle custom-handle-${axis}`} />}
      >
        <span>Contents</span>
      </ResizableBox>

      <div className="content">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          autoScroll
        >
          {/* <Announcements /> */}
          <Sidebar fieldsRegKey={sidebarFieldsRegenKey} />
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={fields.map((f: any) => f.id)}
          >
            <Canvas fields={fields} />
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeSidebarField ? (
              <SidebarField overlay field={activeSidebarField} />
            ) : null}
            {activeField ? <Field overlay field={activeField} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
