import { twMerge } from "tailwind-merge";

// define type
type CheckRadioType = {
  children?: React.ReactNode;
  type: "checkbox" | "radio";   
};

// extent props
type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & CheckRadioType

export default function CheckRadio({ children, color = "primary", ...props }: InputProps) {
  return (   
    <div className={twMerge("check-radio", props.className)}>
      <input {...props} className="check-radio-input" />
      {children && (<label className="check-radio-label" htmlFor={props.id}>{children}</label>)}
    </div>
  );
}
