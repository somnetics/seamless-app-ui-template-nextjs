import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import Textbox from "../Textbox";

import { renderers } from "@/components/FomBuilder/fields";
import { useEffect, useRef } from "react";

function getRenderer(type: any) {
  if (type === "spacer") {
    return () => {
      return <div className="spacer">spacer</div>;
    };
  }

  return renderers[type] || (() => <div>No renderer found for {type}</div>);
}

export function Field(props: any) {
  const { field, overlay, ...rest } = props;
  const { type } = field;
  
  const Component = getRenderer(type);

  let className = "canvas-field";
  if (overlay) {
    className += " overlay";
  }

  return (
    <div className={className}>
      <Component {...rest} />
    </div>
  );
}

function SortableField(props: any) {
  const { id, index, field } = props;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      index,
      id,
      field,
    },
  });

  const style = {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "start",
    // flex: 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="canvas-field-item" ref={setNodeRef} style={style} {...attributes}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        gap: 6
      }}>
        <Field field={field} />
        <div className="sidebar-field-drag-handle" {...listeners}>
          ...
        </div>
      </div>
    </div>
  );
}

export default function Canvas(props: any) {
  const { fields } = props;
  const gridRef = useRef(null)

  // const { listeners, setNodeRef, transform, transition } = useDroppable({
  const { setNodeRef } = useDroppable({
    id: "canvas_droppable",
    data: {
      parent: null,
      isContainer: true,
    },
  });

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // };



  useEffect(() => {
    if (gridRef.current) {
      const styles = getComputedStyle(gridRef.current)
      console.log(styles.gridTemplateColumns)
    }
  }, [])

  return (
    // <div ref={setNodeRef} className="canvas" style={style} {...listeners}>
    <div ref={setNodeRef} className="canvas">
      <div className="canvas-fields" ref={gridRef}>
        {fields?.map((f: any, i: number) => (
          <SortableField key={f.id} id={f.id} field={f} index={i} />
        ))}
      </div>
    </div>
  );
}
