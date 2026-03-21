"use client";

interface InputPresetProps {
  type?: "text" | "number";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const filterNumber = (value: string) =>
  value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

const InputPreset = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}: InputPresetProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      e.target.value = filterNumber(e.target.value);
    }
    onChange(e);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary ${className}`}
    />
  );
};

export default InputPreset;
