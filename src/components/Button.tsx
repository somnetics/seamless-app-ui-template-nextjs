type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
import styles from "./Button.module.css";

type ButtonType = {
  children: React.ReactNode;
  type?: ButtonProps["type"];
  color?: string;
  disabled?: boolean;
  className?: string;
  processing?: boolean;
  onClick?: any;
};

export default function Button({ children, type = "button", color = "primary", disabled = false, className = "", processing = false, onClick }: ButtonType) {
  return (
    <button type={type} disabled={disabled} className={`${styles.btn} ${disabled ? styles.disabled : styles[color] + " " + className} ${disabled || processing ? "pe-none" : "cursor-pointer"}`} onClick={onClick}>
      {processing ? <span className={styles.loader}></span> : ""}
      {processing ? "Processing..." : children}
    </button>
  );
}
