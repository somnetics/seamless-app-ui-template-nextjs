import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// define type
type TextareaType = {
  esize?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg";
};

// extent props
type TextareaProps = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & TextareaType

// definr variants
const variants = cva(
  "txtarea",
  {
    variants: {
      color: {
        primary: "primary",
        readonly: "readonly",
        disabled: "disabled pe-none",
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
      }
    },
  }
);

// definr sizes
const sizes = cva(
  "txtarea-input",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
      }
    },
  }
);

export default function Textarea({ esize = "md", rounded = "md", ...props }: TextareaProps) {
  return (
    <div className={twMerge(variants({ color: props.disabled ? "disabled" : props.readOnly ? "readonly" : "primary", rounded: rounded }), props.className)}>
      <textarea rows={6} {...props} className={sizes({ size: esize })} />
    </div>
  );
}
