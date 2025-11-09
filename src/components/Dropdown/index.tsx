import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// option type
export type OptionType = {
  label: string;
  value: string;
}

// define type
type DropdownType = {
  esize?: "sm" | "md" | "lg";  
  rounded?: "sm" | "md" | "lg";
  options?: OptionType[];
};

// extent props
type DropdownProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & DropdownType

// define variants
const variants = cva(
  "select",
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
  "select-input",
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

export default function DropDown({ esize = "md", rounded = "md", options = [], ...props }: DropdownProps) {
  return (
    <div className={twMerge(variants({ color: props.disabled ? "disabled" : "primary", rounded: rounded }), props.className)}>
      <select {...props} className={sizes({ size: esize })}>
        {options.map((option: OptionType, index: number) =>
          <option key={index} value={option.value}>{option.label}</option>
        )}
      </select>
    </div>
  );
}
