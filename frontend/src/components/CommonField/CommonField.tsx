import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";

interface CommonFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  required?: boolean;
}

const CommonField: React.FC<CommonFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  id,
  className,
  labelClassName,
  errorClassName,
  required = false,
}) => {
  const { errors, touched } = useFormikContext<Record<string, string>>();

  const hasError = errors[name] && touched[name];

  const defaultFieldClassName = `w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 outline-none ${
    hasError
      ? "border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500"
      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
  }`;

  const defaultLabelClassName = "block text-sm font-medium text-gray-700 mb-2";
  const defaultErrorClassName = "mt-1 text-sm text-red-600";

  return (
    <div>
      <label
        htmlFor={id || name}
        className={labelClassName || defaultLabelClassName}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Field
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={className || defaultFieldClassName}
      />
      <ErrorMessage
        name={name}
        component="p"
        className={errorClassName || defaultErrorClassName}
      />
    </div>
  );
};

export default CommonField;
