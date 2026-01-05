import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import Button from "@/components/Button";
import CheckRadio from "@/components/CheckRadio";
import Textbox from "@/components/Textbox";
import DropDown, { OptionType } from "@/components/Dropdown";
import Textarea from "@/components/Textarea";
import FileInput from "@/components/FileInput";
import AutoSuggest from "@/components/AutoSuggest";

// define properties
type FieldType = {
  id?: string | undefined;
  field: string;
  label: string;
  placeholder?: string | undefined;
  alias?: string | undefined;
  type?: "text" | "date" | "password" | "hidden" | "textarea" | "dropdown" | "fileinput" | "time" | "autocomplete";
  options?: OptionType[];
  labelField?: string,
  valueField?: string,
  renderField?: (item: any) => OptionType,
  width?: number | undefined;
  defaultValue?: string | undefined;
  columns?: number | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  multiple?: boolean | undefined;
  endpoint?: string | undefined;
  method?: string | undefined,
}

// define FormField type 
type FormFieldType = {
  formFields: FieldType[];
  size?: "sm" | "md" | "lg" | undefined;
  rounded?: "sm" | "md" | "lg" | undefined;
  method: string | undefined;
  endpoint: URL | RequestInfo;
};

type FormFieldProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & FormFieldType;

export default function CreateForm({ formFields, size, rounded, method, endpoint, ...props }: FormFieldProps) {

  const [fieldsValue, setFieldsValue] = useState<any>({});
  const [isEmpty, setIsEmpty] = useState<{ [key: string]: boolean }>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // get element
    const { name, value } = e.target;

    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      const values = Array.from(
        e.target.selectedOptions,
        option => option.value
      );

      // set data
      setFieldsValue((prevState: any) => ({
        ...prevState,
        [name]: values
      }));
    } else {
      // set data
      setFieldsValue((prevState: any) => ({
        ...prevState,
        [name]: value
      }));
    }

    // set field
    setIsEmpty((prevState: { [key: string]: boolean }) => ({
      ...prevState,
      [name]: value === ""
    }));
  }

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    //declare a field to check if any required field is empty
    const newEmptyState: { [key: string]: boolean } = {};

    formFields.forEach((formField) => {
      if (formField.required) {
        const value = fieldsValue[formField.field];
        newEmptyState[formField.field] = value === null || value === undefined || value === "";
      } else {
        newEmptyState[formField.field] = false;
      }
    });

    console.log(fieldsValue);

    //submit form api call
    //submit when all required fields are filled
    if (Object.values(newEmptyState).every((value) => value === false)) {

      // send response
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldsValue),
      });

      //convert response to json
      const data = await response.json();

      console.log("API Response", data);

      alert("Form Submitted")

      //reset fields
      setFieldsValue("");

    } else {
      console.log("Fill required fields")
    }

    setIsEmpty(newEmptyState);
  }

  return (
    <div className="flex items-center justify-center min-h-[92vh] flex-0">
      <form {...props} onSubmit={submitForm} className={props.className} noValidate>
        <div className="grid grid-cols-12 space-y-4 gap-4 w-[600px]">
          {formFields.map((formField) =>
            formField.type == "text" || formField.type == "date" || formField.type == "time" || formField.type == "password" || typeof formField.type === "undefined" ?

              <div className={`flex flex-col gap-2 col-span-${formField.width}`} key={formField.field || formField.id}>
                <label htmlFor={formField.field || formField.id}>{formField.label}{formField.required ? "*" : ""}</label>
                <Textbox
                  id={formField.id}
                  type={formField.type}
                  esize={size}
                  rounded={rounded}
                  name={formField.field}
                  placeholder={formField.placeholder || formField.label}
                  value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""}
                  onChange={onChange}
                  required={formField.required}
                  disabled={formField.disabled}
                  className={twMerge(`${formField.required && isEmpty[formField.field] ? "outline-red-500/60 dark:outline-red-500/60 outline-2 " : ""} `, formField.className)}
                />
                {formField.required && isEmpty[formField.field] && <p className="text-red-500 text-xs font-light ">This field is required</p>}
              </div>

              : formField.type == "hidden" ?

                <div key={formField.field || formField.id}>
                  <Textbox
                    id={formField.id}
                    type="hidden"
                    esize={size}
                    rounded={rounded}
                    name={formField.field}
                    value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""}
                    required={formField.required}
                  />
                </div>

                : formField.type == "textarea" ?

                  <div className={`flex flex-col gap-2 col-span-${formField.width}`} key={formField.field || formField.id}>
                    <label htmlFor={formField.field || formField.id}>{formField.label}{formField.required ? "*" : ""}</label>
                    <Textarea
                      id={formField.id}
                      esize={size}
                      rounded={rounded}
                      name={formField.field}
                      placeholder={formField.label}
                      value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""}
                      onChange={onChange}
                      required={formField.required}
                      disabled={formField.disabled}
                      className={twMerge(`${formField.required && isEmpty[formField.field] ? "outline-red-500/60 dark:outline-red-500/60 outline-2" : ""} `, formField.className)}
                    />
                    {formField.required && isEmpty[formField.field] && <p className="text-red-500 text-xs font-light">This field is required</p>}
                  </div>

                  : formField.type == "fileinput" ?

                    <div className={`flex flex-col gap-2 col-span-${formField.width}`} key={formField.field || formField.id}>
                      <label htmlFor={formField.field || formField.id}>{formField.label}{formField.required ? "*" : ""}</label>
                      <FileInput
                        id={formField.id}
                        esize={size}
                        rounded={rounded}
                        name={formField.field}
                        value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""}
                        onChange={onChange}
                        required={formField.required}
                        disabled={formField.disabled}
                        multiple={formField.multiple}
                        className={twMerge(`${formField.required && isEmpty[formField.field] ? "outline-red-500/60 dark:outline-red-500/60 outline-2" : ""} `, formField.className)}
                      />
                      {formField.required && isEmpty[formField.field] && <p className="text-red-500 text-xs font-light">This field is required</p>}
                    </div>

                    : formField.type == "autocomplete" ?

                      <div className={`flex flex-col gap-2 col-span-${formField.width}`} key={formField.field || formField.id}>
                        <label htmlFor={formField.field || formField.id}>{formField.label}{formField.required ? "*" : ""}</label>
                        <AutoSuggest
                          name={formField.field}
                          options={formField.options || []}
                          multiple={formField.multiple}
                          endpoint={formField.endpoint}
                          method={formField.method}
                          labelField={formField.labelField}
                          valueField={formField.valueField}
                          renderField={formField.renderField}
                          onChange={onChange}
                          value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""}
                        />
                        {formField.required && isEmpty[formField.field] && <p className="text-red-500 text-xs font-light">This field is required</p>}
                      </div>

                      : formField.type == "dropdown" && (

                        <div className={`flex flex-col gap-2 col-span-${formField.width}`} key={formField.field || formField.id}>
                          <label htmlFor="dropdown">{formField.label}{formField.required ? "*" : ""}</label>
                          <DropDown
                            id={formField.id}
                            esize={size}
                            rounded={rounded}
                            name={formField.field}
                            options={[{ label: "", value: "" }, ...formField.options || []]}
                            value={typeof fieldsValue[formField.field] !== "undefined" ? fieldsValue[formField.field] : formField.defaultValue || ""}
                            onChange={onChange}
                            required={formField.required}
                            disabled={formField.disabled}
                            className={twMerge(`${formField.required && isEmpty[formField.field] ? "outline-red-500/60 dark:outline-red-500/60 outline-2" : ""} `, formField.className)}
                          />
                          {formField.required && isEmpty[formField.field] && <p className="text-red-500 text-xs font-light">This field is required</p>}
                        </div>
                      ))}
        </div>
        <div className="pt-4">
          <Button type="submit" color="primary">Submit</Button>
        </div>
      </form>
    </div>
  );
}
