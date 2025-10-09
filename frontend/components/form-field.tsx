import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormFieldProps } from "@/types/types"

export function FormField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  icon,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`h-12 rounded-lg border-gray-300 ${icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  )
}