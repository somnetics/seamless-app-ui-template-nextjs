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
  size?: string | undefined;
}

// define prop type
type FormFieldProps = {
  formFields: FieldType[];
};

export default function CreateForm({ formFields }: FormFieldProps) {

  const [fieldsValue, setFieldsValue] = useState<any>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    // get element
    const { name, value } = e.target;

    // set data
    setFieldsValue((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  }

  return (
    <div className="flex items-center justify-center min-h-[92vh] bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border border-black/10 rounded-xl p-6 shadow-lg w-[650px] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-12 gap-4">
          {formFields.map((formField) =>
            formField.type == "text" || formField.type == "date" || formField.type == "password" || typeof formField.type === "undefined" ?
              <div className={`flex flex-col gap-2 mb-4 col-span-${formField.width}`}>
                <label htmlFor={formField.field || formField.id}>{formField.label}</label>
                <Textbox type={formField.type} esize="sm" rounded="sm" name={formField.field} id={formField.id} placeholder={formField.placeHolder || formField.label} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} onChange={onChange} />
              </div>
              : formField.type == "hidden" ?
                <Textbox type="hidden" esize="sm" rounded="sm" name={formField.field} id={formField.id} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} />
                : formField.type == "textarea" ?
                  <div className={`flex flex-col gap-2 mb-4 col-span-${formField.width}`}>
                    <label htmlFor={formField.field || formField.id}>{formField.label}</label>
                    <Textarea esize="sm" rounded="sm" name={formField.field} id={formField.id} placeholder={formField.label} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} onChange={onChange} />
                  </div>
                  : formField.type == "fileinput" ?
                    <div className={`flex flex-col gap-2 mb-4 col-span-${formField.width}`}>
                      <label htmlFor={formField.field || formField.id}>{formField.label}</label>
                      <FileInput esize="sm" rounded="sm" name={formField.field} id={formField.id} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} onChange={onChange} />
                    </div>
                    : formField.type == "dropdown" && (
                      <div className={`flex flex-col gap-2 mb-4 col-span-${formField.width}`}>
                        <label htmlFor="dropdown">{formField.label}</label>
                        <DropDown esize="sm" rounded="sm" name={formField.field} options={[{ label: "", value: "" }, ...formField.options || []]} id={formField.id} value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""} onChange={onChange} />
                      </div>
                    )
          )}
        </div>
      </div>
    </div>
  );
}
