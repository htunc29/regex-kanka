"use client";

interface RegexInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  mono?: boolean;
}

export default function RegexInput({
  value,
  onChange,
  label,
  placeholder,
  mono = true,
}: RegexInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
          text-white placeholder-gray-500 focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:border-transparent transition-all
          ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}
