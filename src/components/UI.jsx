import React, { useState } from "react";

// Input validation utilities
export const validationRules = {
  textOnly: (value) => /^[a-zA-Z\s]*$/.test(value),
  numberOnly: (value) => /^[0-9]*$/.test(value),
  alphanumeric: (value) => /^[a-zA-Z0-9_-]*$/.test(value),
  phone: (value) => /^[0-9+\s()-]*$/.test(value),
  email: (value) => /^[^\s@]*@?[^\s@]*$/.test(value),
};

export const GlassCard = ({ children, className = "", ...props }) => (
  <div className={`glass-card ${className}`} {...props}>
    {children}
  </div>
);

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => (
  <button
    className={`px-6 py-2 rounded-lg font-medium transition-all ${
      variant === "primary" ? "btn-primary" : "btn-secondary"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Input = ({
  icon: Icon,
  className = "",
  numberOnly = false,
  textOnly = false,
  alphanumericOnly = false,
  phoneOnly = false,
  maxLength = null,
  charLimit = null,
  onValidInput = null,
  ...props
}) => {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    let value = e.target.value;
    const limit = maxLength || charLimit;

    // Apply character limit
    if (limit && value.length > limit) {
      value = value.slice(0, limit);
    }

    // Apply type restrictions
    if (numberOnly && !validationRules.numberOnly(value)) {
      return;
    }
    if (textOnly && !validationRules.textOnly(value)) {
      return;
    }
    if (alphanumericOnly && !validationRules.alphanumeric(value)) {
      return;
    }
    if (phoneOnly && !validationRules.phone(value)) {
      return;
    }

    setCharCount(value.length);

    // Call original onChange
    if (props.onChange) {
      e.target.value = value;
      props.onChange(e);
    }
  };

  const limit = maxLength || charLimit;

  return (
    <div className="relative group/input w-full">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-accent opacity-50 group-focus-within/input:opacity-100 transition-all duration-300">
          <Icon size={18} strokeWidth={2.5} />
        </div>
      )}
      <input
        className={`input-field w-full ${Icon ? "pl-12" : "px-4"} py-3.5 focus:border-primary-accent/50 ${className}`}
        onChange={handleChange}
        {...props}
      />
      {limit && (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] opacity-50"
          style={{ color: "var(--text-secondary)" }}
        >
          {charCount}/{limit}
        </span>
      )}
    </div>
  );
};

export const TextArea = ({
  icon: Icon,
  className = "",
  numberOnly = false,
  textOnly = false,
  alphanumericOnly = false,
  maxLength = null,
  charLimit = null,
  ...props
}) => {
  const [charCount, setCharCount] = useState(props.value?.length || 0);

  const handleChange = (e) => {
    let value = e.target.value;
    const limit = maxLength || charLimit;

    // Apply character limit
    if (limit && value.length > limit) {
      value = value.slice(0, limit);
    }

    // Apply type restrictions
    if (textOnly && !validationRules.textOnly(value)) {
      return;
    }

    setCharCount(value.length);

    // Call original onChange
    if (props.onChange) {
      e.target.value = value;
      props.onChange(e);
    }
  };

  const limit = maxLength || charLimit;

  return (
    <div className="relative group/input w-full">
      {Icon && (
        <div className="absolute left-4 top-5 text-primary-accent opacity-50 group-focus-within/input:opacity-100 transition-all duration-300">
          <Icon size={18} strokeWidth={2.5} />
        </div>
      )}
      <textarea
        className={`input-field w-full resize-none ${Icon ? "pl-12" : "px-4"} py-4 focus:border-primary-accent/50 ${className}`}
        onChange={handleChange}
        {...props}
      />
      {limit && (
        <span
          className="absolute right-3 bottom-3 text-[10px] opacity-50"
          style={{ color: "var(--text-secondary)" }}
        >
          {charCount}/{limit}
        </span>
      )}
    </div>
  );
};

export const Badge = ({ children, className = "" }) => (
  <span
    className={`text-xs bg-purple-500 bg-opacity-20 px-3 py-1 rounded-full ${className}`}
  >
    {children}
  </span>
);

export const Spinner = ({ className = "" }) => (
  <div className={`spinner ${className}`}></div>
);
