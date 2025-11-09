import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// option type
type TagsType = {
  label: string;
  value: string;
}

// define type
type TagProps = {
  size?: "xs" | "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  tags?: TagsType[];
  className?: string;
  value?: string;
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

export default function Tags({ size = "sm", rounded = "full", tags = [], value, className }: TagProps) {
  return (
    <div className={twMerge("flex items-center flex-wrap gap-3", className)}>
      {tags.map((tag: TagsType, index: number) => (
        <button key={index} type="button" className={variants({ size: size, rounded: rounded, selected: tag.value == value })} data-name={tag.value}>
          {tag.label}
        </button>
      ))}
    </div>
  );
}
