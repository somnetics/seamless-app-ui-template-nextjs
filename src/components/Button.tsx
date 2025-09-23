type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonType = {
  children: React.ReactNode;
  type?: ButtonProps["type"];
  disabled?: boolean;
  className?: string;
  processing?: boolean;
  onClick?: any;
};

export default function Button({ children, type = "button", disabled = false, className = "", processing = false, onClick }: ButtonType) {
  return (
    <button type={type} disabled={disabled} className={`flex items-center gap-2 text-sm font-semibold p-2 rounded transition ${disabled ? "text-gray-400" : `cursor-pointer ${className}`} ${processing ? "pe-none" : ""}`} onClick={onClick}>
      {processing ? <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span> : ""}
      {processing ? "Processing..." : children}
    </button>
  );
}
