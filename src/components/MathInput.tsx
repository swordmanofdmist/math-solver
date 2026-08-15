import type { ChangeEventHandler } from "react";

type MathInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: "text" | "number";
  min?: number;
  required?: boolean;
};

export default function MathInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  required = false,
}: MathInputProps) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        required={required}
      />
    </label>
  );
}
