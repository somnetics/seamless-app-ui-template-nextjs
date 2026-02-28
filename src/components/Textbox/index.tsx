import { useState } from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/Icon";

// define type
type TextboxType = {
  esize?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg";
};

// extent props
type TextboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & TextboxType

// define variants
const variants = cva(
  "txt",
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
  "txt-input",
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

export default function Textbox({ esize = "md", rounded = "md", ...props }: TextboxProps) {
  const [inputType, setInputType] = useState("password");

  const toggleType = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setInputType(inputType === "password" ? "text" : "password");
  };

  return (
    <div className={twMerge("form-element", props.className)}>
      {props.type === "password" ?
        <>
          <input {...props} type={inputType} className={sizes({ size: esize })} />
          <a href="#" className="px-3" onClick={toggleType} tabIndex={-1}>
            <Icon name={inputType == "text" ? "EyeOff" : "Eye"} size={18} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 cursor-pointer" />
          </a>
        </>
        : props.type === "search" ?
          <div className="search">
            <Icon name="Search" size={16} className="text-slate-400 w-9" />
            <input {...props} type="search" className={twMerge("!pl-0", sizes({ size: esize }))} />
          </div>
          : <input {...props} className={sizes({ size: esize })} />
      }
    </div>
    // <div className={twMerge(variants({ color: props.disabled ? "disabled" : props.readOnly ? "readonly" : "primary", rounded: rounded }), props.className)}>
    //   {props.type === "password" ?
    //     <div className="secure">
    //       <input {...props} type={inputType} className={sizes({ size: esize })} />
    //       <a href="#" className="px-3" onClick={toggleType}>
    //         <Icon name={inputType == "text" ? "EyeOff" : "Eye"} size={20} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 cursor-pointer" />
    //       </a>
    //     </div>
    //     : props.type === "search" ?
    //       <div className="search">
    //         <Icon name="Search" size={16} className="text-slate-400 w-9" />
    //         <input {...props} type="search" className={twMerge("!pl-0", sizes({ size: esize }))} />
    //       </div>
    //       : <input {...props} className={sizes({ size: esize })} />
    //   }
    // </div>
  );
}
