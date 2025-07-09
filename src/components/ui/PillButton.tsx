import React from "react";
import { ChevronDown } from "lucide-react";

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const PillButton: React.FC<PillButtonProps> = ({ icon, children, className = "", disabled, ...props }) => (
  <button
    className={`flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-full px-7 py-3 text-lg shadow-none border-none focus:outline-none transition-colors ${
      disabled ? 'opacity-50 cursor-not-allowed hover:bg-gray-100' : ''
    } ${className}`}
    disabled={disabled}
    {...props}
  >
    <span className="flex items-center text-xl">{icon}</span>
    <span>{children}</span>
    <ChevronDown className="w-5 h-5 ml-1 text-black" />
  </button>
);

export default PillButton; 