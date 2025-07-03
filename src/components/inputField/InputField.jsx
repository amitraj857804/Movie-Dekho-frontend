import React from "react";

function InputField({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className,
  min,
  max,
  placeholder,
  inputmode = null,
  readOnly,
  ...props
}) {
  const validationRules = {
    required: { value: required, message },
    minLength: min
      ? {
          value: min,
          message:
            " password must consit of characters and numbers and have minimun lenght is 4 ",
        }
      : null,
    maxLength: max
      ? {
          value: max,
          message: " Mobile no should be 10 digit ",
        }
      : null,
  };

  if (type === "email") {
    validationRules.pattern = {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Invalid email",
    };
  } else if (type === "password") {
    validationRules.pattern = {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: "Password must consist of minimum 4 characters and 4 number ",
    };
  } else if (id === "phone") {
    validationRules.pattern = {
      value: /^\d{10}$/,
      message: "Mobile no should be 10 digit",
    };
    validationRules.minLength = {
      value: 10,
      message: "Mobile no should be 10 digit",
    };
    validationRules.maxLength = {
      value: 10,
      message: "Mobile no should be 10 digit",
    };
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className={`${className ? className : ""} font-semibold text-md`}
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        maxLength={id === "phone" ? max : undefined}
        className={`${
          className ? className : ""
        } px-2 py-2 border outline-none bg-transparent text-slate-700 rounded-md ${
          errors[id]?.message ? "border-red-500" : "border-slate-600"
        }`}
        {...register(id, validationRules)}
        readOnly={readOnly}
        inputMode={inputmode}
        {...props}
      />

      {errors[id]?.message && (
        <p className="text-sm font-semibold text-red-600 mt-0 w-full">
          {errors[id]?.message}*
        </p>
      )}
    </div>
  );
}

export default InputField;
