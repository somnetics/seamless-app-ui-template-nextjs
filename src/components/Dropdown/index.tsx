import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// option type
type OptionType = {
  label: string;
  value: string;
}

// define type
type DropdownType = {
  label: string;
  esize?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "danger";
  rounded?: "sm" | "md" | "lg";
  options?: OptionType[];
};

// extent props
type DropdownProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & DropdownType

// define variants
const variants = cva(
  "",
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

export default function DropDown({ label, color = "primary", esize = "md", rounded = "md", options = [], ...props }: DropdownProps) {
  return (
    // <div className="input-dropdown-group">
    //   {label && (
    //     <label className={twMerge("input-label", variants({ size: esize }))}>
    //       {label}
    //     </label>
    //   )}
    //   <div className={twMerge("input-dropdown-wrapper", variants({ color: props.disabled ? "disabled" : color, rounded: rounded }), props.className)}>
    //     <select {...props} className={twMerge("input-dropdown", variants({ size: esize }), props.className)}>
    //       {options.map((option: OptionType, index: number) =>
    //         <option key={index} value={option.value} selected={option.value == props.value}>{option.label}</option>
    //       )}
    //     </select>
    //   </div>
    // </div>

    <div className="input-dropdown-group mb-2">
      {/* {label && (
        <label className={twMerge("input-label", variants({ size: esize }))}>
          {label}
        </label>
      )} */}
      {/* <div className="bg-white dark:bg-gray-600 outline-2 outline-black/10 dark:outline-white/10 focus-within:outline-primary-600 dark:focus-within:outline-primary-600 rounded-sm">
        <input type="text" name={column.field} className="outline-none py-1 px-2 w-full text-sm font-light" placeholder={column.label} defaultValue="" />
      </div> */}
      <div className="bg-white dark:bg-gray-600 outline-2 outline-black/10 dark:outline-white/10 focus-within:outline-primary-600 dark:focus-within:outline-primary-600 rounded-sm">
        <select {...props} className="outline-none py-1 px-2 w-full text-sm font-light">
          {options.map((option: OptionType, index: number) =>
            <option key={index} value={option.value} selected={option.value == props.value} className="dark:bg-gray-600">{option.label}</option>
          )}
        </select>
      </div>
    </div>
  );
}
