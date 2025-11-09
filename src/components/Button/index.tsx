import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// define type
type ButtonType = {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "danger";
  rounded?: "sm" | "md" | "lg";
  processing?: boolean;
};

// extent props
type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonType

// definr variants
const variants = cva(
  "btn",
  {
    variants: {
      color: {
        primary: "primary",
        secondary: "secondary",
        success: "success",
        danger: "danger",
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

export default function Button({ children, color = "primary", size = "md", rounded = "md", processing = false, ...props }: ButtonProps) {
  return (    
    <button {...props} className={twMerge(variants({ color: props.disabled ? "disabled" : color, size: size, rounded: rounded }), props.className)}>
      {processing ? <span className="loader"></span> : ""}
      {processing ? "Processing..." : children}
    </button>
  );
}
