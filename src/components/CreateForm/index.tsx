import { cva } from "class-variance-authority";
import { Eye, Calendar, EyeOff } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { propagateServerField } from "next/dist/server/lib/render-server";
import { useState } from "react";
import Button from "@/components/Button";
import CheckRadio from "@/components/CheckRadio";
import Textbox from "@/components/Textbox";

// Button, CheckRadio, Dropdown, Textarea, TextBox

// define type
type FormType = {
  type?: "Button" | "CheckRadio" | "Dropdown" | "Textarea" | "TextBox";
};

// extent props
type FormProps = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & FormType

// definr variants
const variants = cva(
  "txt",
  {
    variants: {
      type: {
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

export default function CreateForm({ ...props }: FormProps) {

  const type = ["Button", "CheckRadio", "Dropdown", "Textarea", "TextBox"]
  const selected = type.find(type => type === props.type)
  console.log(selected)

  const [isText, setIsText] = useState<boolean>(false);

  const toggleType = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    setIsText(!isText);
  }

  return (
    <div>
      {((props.type === "Button") &&
        <Button type="button" color="primary">Button</Button>
      )}
      {((props.type === "CheckRadio") &&
        <CheckRadio color="primary" type={"checkbox"}>CheckRadio</CheckRadio>
      )}
      {((props.type === "TextBox") &&
        <Textbox type='readonly' placeholder="password" />
      )}
      <ul>
        {type.find(type => type === props.type)}
      </ul>


      {/* {(props.type == "password" &&
        <div className={twMerge(variants({ type: props.disabled ? "disabled" : props.readOnly ? "readonly" : "primary", rounded: rounded }), props.className, "flex justify-between align-end")}>
          <input {...props} type={isText ? "text" : "password"} className={twMerge(sizes({ size: esize }))} />
          <div className={"flex items-center justify-between px-4 py-2"}>
            {(!isText && <Eye size={20} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 cursor-pointer" onClick={toggleType} />)}
            {(isText && <EyeOff size={20} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 cursor-pointer" onClick={toggleType} />)}
          </div>
        </div>
      )} */}
    </div>
  );
}
