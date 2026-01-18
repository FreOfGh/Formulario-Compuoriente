import { LucideIcon } from "lucide-react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { FormSchema } from "@/lib/validations/formulario";

interface InputFieldProps {
  label: string;
  name: keyof FormSchema;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<FormSchema>;
  error?: FieldError;
  icon?: LucideIcon;
  className?: string;
}

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  icon: Icon,
  className = "",
}: InputFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`
            w-full px-4 py-3 border rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            outline-none transition
            ${Icon ? "pl-10" : "pl-4"}
            ${error ? "border-red-500" : "border-gray-300"}
            hover:border-gray-400
          `}
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm flex items-center">
          <span className="mr-1">⚠️</span>
          {error.message}
        </p>
      )}
    </div>
  );
}