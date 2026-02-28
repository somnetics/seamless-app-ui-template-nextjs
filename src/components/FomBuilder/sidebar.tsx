import { useDraggable } from "@dnd-kit/core";
// import { nanoid } from "nanoid";
import { randomId } from "@/libs/functions";
import { useRef } from "react";


import { fields } from "@/components/FomBuilder/fields";

export function SidebarField(props: any) {
  const { field, overlay } = props;
  const { title } = field;

  let className = "sidebar-field";
  if (overlay) {
    className += " overlay";
  }

  return <div className={className}>{title}</div>;
}

function DraggableSidebarField(props: any) {
  const { field, ...rest } = props;

  const id = useRef(randomId());

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id.current,
    data: {
      field,
      fromSidebar: true,
    },
  });

  return (
    <div ref={setNodeRef} className="sidebar-field">
      <div className="sidebar-field-drag-handle" {...listeners}>
        ...
      </div>
      <SidebarField field={field} {...rest} />
    </div>
  );
}

export default function Sidebar(props: any) {
  const { fieldsRegKey } = props;

  return (
    <div key={fieldsRegKey} className="sidebar">
      {fields.map((f: any) => (
        <DraggableSidebarField key={f.type} field={f} />
      ))}
    </div>
  );
}
