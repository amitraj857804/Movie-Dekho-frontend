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
  showError = true,
  mobileShowError = true,
  centerMobileError = false, 
  ...props
}) {
  const validationRules = {
    required: { value: required, message },
    
  };

  if (type === "email") {
    validationRules.pattern = {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "*Invalid email",
    };
  } else if (type === "password") {
    validationRules.pattern = {
      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message:"*Minimun lenght 6 required",
    };
  } else if (id === "phone") {
    validationRules.pattern = {
      value: /^\d{10}$/,
      message: "*Mobile no should be 10 digit",
    };
    validationRules.minLength = {
      value: 10,
      message: "*Mobile no should be 10 digit",
    };
    validationRules.maxLength = {
      value: 10,
      message: "*Mobile no should be 10 digit",
    };
  }

  return (
    <div className={`flex flex-col gap-1 relative ${errors[id]?.message && mobileShowError ? 'sm:mb-0 mb-6' : ''}`}>
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
        } px-2 py-2 border outline-none bg-white/90 text-black rounded-full  ${
          errors[id]?.message ? "border-red-500" : "border-slate-600"
        }`}
        {...register(id, validationRules)}
        readOnly={readOnly}
        inputMode={inputmode}
        {...props}
      />
      
      {/* Show error on mobile only */}
      {errors[id]?.message && mobileShowError && (
        <p className={`sm:hidden absolute -bottom-8 left-0 right-0 text-xs font-semibold text-red-600 px-2 py-1 pb-3 rounded z-10
        ${centerMobileError ? "text-center" : "" } `}>
          {errors[id]?.message}*
        </p>
      )}
    </div>
  );
}

export default InputField;
