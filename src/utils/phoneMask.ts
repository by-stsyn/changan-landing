import React from "react";

/**
 * Beautiful Russian phone number mask: +7 (XXX) XXX-XX-XX
 * Formatting rules only append brackets and hyphens when actual subsequent digits exist.
 * This guarantees Backspace and Delete will never get stuck on formatting characters.
 */
export function formatPhoneNumber(input: string): string {
  if (!input) return "";

  // Strip all non-digit characters
  let digits = input.replace(/\D/g, "");
  if (!digits) return "";

  // Normalize initial 7 or 8 prefix
  if (digits.startsWith("7") || digits.startsWith("8")) {
    digits = digits.substring(1);
  }

  // If user cleared everything after the prefix, let input be empty
  if (!digits) return "";

  // Max 10 digits after +7
  digits = digits.substring(0, 10);

  let res = "+7";
  if (digits.length > 0) {
    res += " (" + digits.substring(0, 3);
  }
  if (digits.length > 3) {
    res += ") " + digits.substring(3, 6);
  }
  if (digits.length > 6) {
    res += "-" + digits.substring(6, 8);
  }
  if (digits.length > 8) {
    res += "-" + digits.substring(8, 10);
  }

  return res;
}

/**
 * Handles Backspace when cursor is directly after a non-digit formatting character
 * such as ")", "-", " ", or "(", so the user can erase backwards seamlessly without getting stuck.
 */
export function handlePhoneKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
  value: string,
  onChange: (val: string) => void
) {
  if (e.key === "Backspace") {
    const input = e.currentTarget;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    // If text is selected (range delete), let default browser delete handle it
    if (start !== end) return;

    // If at beginning or empty
    if (start === 0 || !value) return;

    // Character immediately to the left of the cursor
    const charBefore = value[start - 1];

    // If it's a formatting character (not a digit)
    if (charBefore && /\D/.test(charBefore)) {
      e.preventDefault();

      // Find the previous digit before the cursor
      let digitIdx = -1;
      for (let i = start - 1; i >= 0; i--) {
        // We only delete user digits, not the +7 prefix (indices 0 and 1)
        if (/\d/.test(value[i]) && i > 1) {
          digitIdx = i;
          break;
        }
      }

      if (digitIdx !== -1) {
        // Remove that digit and re-format
        const newRaw = value.slice(0, digitIdx) + value.slice(start);
        const formatted = formatPhoneNumber(newRaw);
        onChange(formatted);
      } else {
        // If there are no user digits before cursor, clear completely
        onChange("");
      }
    }
  }
}

/**
 * Checks if the phone number has all required digits
 */
export function isPhoneValid(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11;
}
