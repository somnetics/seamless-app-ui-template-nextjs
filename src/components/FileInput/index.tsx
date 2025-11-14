import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// define type
type FileInputType = {
  esize?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg";
};

// extent props
type FileInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & FileInputType

// define variants
const variants = cva(
  "file",
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
      },
      size: {
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
      }
    },
  }
);

// define sizes
const sizes = cva(
  "file-input",
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

export default function FileInput({ esize = "md", rounded = "sm", ...props }: FileInputProps) {
  return (
    <div className={twMerge(variants({ color: props.disabled ? "disabled" : props.readOnly ? "readonly" : "primary", rounded: rounded }), props.className)}>
      <input {...props} type="file" className={sizes({ size: esize })} />
    </div>
  );
}
