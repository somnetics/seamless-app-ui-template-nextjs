import { cva } from "class-variance-authority";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

// option type
export type TagsType = {
  label: string;
  value: string;
}

// define type
type TagProps = {
  size?: "xs" | "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  tags?: TagsType[];
  className?: string;
  value?: string[];
  onSelect?: (item: TagsType) => void
};

// definr variants
const variants = cva(
  "tag",
  {
    variants: {
      selected: {
        true: "selected",
        false: "default"
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full"
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
      }
    },
  }
);

export default function Tags({ tags = [], value, onSelect, size = "sm", rounded = "full", className }: TagProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // get selected index
    const index = Number(e.currentTarget.dataset.index);

    // set selected index
    setSelectedIndex(index);

    // call onSelect with selected item
    if (typeof onSelect === "function") onSelect(tags[index]);
  };

  return (
    <div className={twMerge("flex items-center flex-wrap gap-3", className)}>
      {tags.map((tag: TagsType, index: number) => (
        <button key={index} type="button" className={variants({ size: size, rounded: rounded, selected: index == selectedIndex || (selectedIndex == -1 && value?.includes(tag.value)) })} data-index={index} onClick={onClick}>
          {tag.label}
        </button>
      ))}
    </div>
  );
}
