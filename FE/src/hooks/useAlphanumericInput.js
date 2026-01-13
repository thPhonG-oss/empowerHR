import { useState } from "react";

export const useAlphanumericInput = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    // Chỉ giữ lại chữ cái (a-z, A-Z) và số (0-9)
    const filtered = inputValue.replace(/[^a-zA-Z0-9]/g, "");
    setValue(filtered);
  };

  return [value, handleChange, setValue];
};

export const filterAlphanumeric = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/[^a-zA-Z0-9]/g, "");
};

export const isAlphanumeric = (value) => {
  if (typeof value !== "string") return false;
  return /^[a-zA-Z0-9]*$/.test(value);
};
