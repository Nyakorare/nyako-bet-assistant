import React from "react";
import clsx from "clsx";

const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  darkMode,
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition duration-200";
  
  const variants = {
    default: darkMode 
      ? "bg-emerald-600 text-white hover:bg-emerald-700" 
      : "bg-emerald-500 text-white hover:bg-emerald-600",
    outline: darkMode 
      ? "border border-emerald-500 text-emerald-400 hover:bg-emerald-900/30" 
      : "border border-emerald-500 text-emerald-600 hover:bg-emerald-50",
    secondary: darkMode 
      ? "bg-gray-700 text-white hover:bg-gray-600" 
      : "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button 
      className={clsx(
        baseStyles, 
        variants[variant], 
        className,
        "flex items-center justify-center"
      )} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;