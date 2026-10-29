import React, { InputHTMLAttributes } from "react";
import { formatPhoneNumber, handlePhoneKeyDown } from "../utils/phoneMask";

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInput({ value, onChange, onKeyDown, ...props }: PhoneInputProps) {
  return (
    <input
      type="tel"
      placeholder="+7 (___) ___-__-__"
      value={value}
      onChange={(e) => onChange(formatPhoneNumber(e.target.value))}
      onKeyDown={(e) => {
        handlePhoneKeyDown(e, value, onChange);
        if (onKeyDown) onKeyDown(e);
      }}
      {...props}
    />
  );
}
