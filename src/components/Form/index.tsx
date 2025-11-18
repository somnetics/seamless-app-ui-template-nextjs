import { cva } from "class-variance-authority";
import { Eye, Calendar, EyeOff } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { propagateServerField } from "next/dist/server/lib/render-server";
import { useState } from "react";
import Button from "@/components/Button";
import CheckRadio from "@/components/CheckRadio";
import Textbox from "@/components/Textbox";
import DropDown, { OptionType } from "@/components/Dropdown";
import Textarea from "@/components/Textarea";
import FileInput from "@/components/FileInput";
import { cornersOfRectangle } from "@dnd-kit/core/dist/utilities/algorithms/helpers";

// define column type
type FieldType = {
  id?: string | undefined;
  field: string;
  label: string;
  placeHolder?: string | undefined;
  alias?: string | undefined;
  type?: "text" | "date" | "password" | "hidden" | "textarea" | "dropdown" | "fileinput" | "file";
  options?: OptionType[];
  width?: number | undefined;
  defaultValue?: string | undefined;
  columns?: number | undefined;
  required?: boolean | undefined;
}

// define prop type
type FormFieldProps = {
  formFields: FieldType[];
  size?: "sm" | "md" | "lg" | undefined;
  rounded?: "sm" | "md" | "lg" | undefined;
};

export default function CreateForm({ formFields, size, rounded }: FormFieldProps) {

  const [fieldsValue, setFieldsValue] = useState<any>({});
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    // get element
    const { name, value } = e.target;

    // set data
    setFieldsValue((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  }

  const checkValidity = () => {
    formFields.map((formField) => {
      console.log(fieldsValue[formField.field])
      formField.required === true
        ? fieldsValue[formField.field] === null || fieldsValue[formField.field] === undefined
          ? (console.log("required & empty"), setIsEmpty(true))
          : (console.log("required & filled"), setIsEmpty(false))
        : console.log("not required");
    }
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[92vh] bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border border-black/10 rounded-xl p-6 shadow-lg w-[650px] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-12 space-y-4 gap-4">
          {formFields.map((formField) =>
            formField.type == "text" || formField.type == "date" || formField.type == "password" || typeof formField.type === "undefined" ?
              <div className={`flex flex-col gap-2 col-span-${formField.width}`}>
                <label htmlFor={formField.field || formField.id}>{formField.label}</label>
                <Textbox type={formField.type} esize={size} rounded={rounded} name={formField.field} id={formField.id} placeholder={formField.placeHolder || formField.label} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} required={formField.required} onChange={onChange} />
                <div>{formField.required && isEmpty && (<label htmlFor={formField.field || formField.id}>Fill this</label>)}</div>
              </div>
              : formField.type == "hidden" ?
                <Textbox type="hidden" esize={size} rounded={rounded} name={formField.field} id={formField.id} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} required={formField.required} />
                : formField.type == "textarea" ?
                  <div className={`flex flex-col gap-2 col-span-${formField.width}`}>
                    <label htmlFor={formField.field || formField.id}>{formField.label}</label>
                    <Textarea esize={size} rounded={rounded} name={formField.field} id={formField.id} placeholder={formField.label} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} onChange={onChange} required={formField.required} />
                  </div>
                  : formField.type == "fileinput" ?
                    <div className={`flex flex-col gap-2 col-span-${formField.width}`}>
                      <label htmlFor={formField.field || formField.id}>{formField.label}</label>
                      <FileInput esize={size} rounded={rounded} name={formField.field} id={formField.id} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} onChange={onChange} required={formField.required} />
                    </div>
                    : formField.type == "dropdown" && (
                      <div className={`flex flex-col gap-2 col-span-${formField.width}`}>
                        <label htmlFor="dropdown">{formField.label}</label>
                        <DropDown esize={size} rounded={rounded} name={formField.field} options={[{ label: "", value: "" }, ...formField.options || []]} id={formField.id} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} onChange={onChange} required={formField.required} />
                      </div>
                    )
          )}
        </div>
        <div className="pt-4">
          <Button type="button" color="primary" onClick={() => checkValidity()}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
