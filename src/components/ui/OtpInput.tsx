import React, { useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = false,
  className = '',
}) => {
  const inputRefs = Array.from({ length }, () => useRef<HTMLInputElement>(null));

  const handleChange = (val: string, idx: number) => {
    let newOtp = value?.split('');
    newOtp[idx] = val;
    if (val && idx < length - 1) {
      inputRefs[idx + 1].current?.focus();
    }
    onChange(newOtp.join('').padEnd(length, ''));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    }
  };

  return (
    <div className={`flex justify-center gap-4 ${className}`}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={inputRefs[idx]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-14 h-14 text-2xl text-center rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={value[idx] || ''}
          onChange={e => handleChange(e.target.value.replace(/\D/g, ''), idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          autoFocus={autoFocus && idx === 0}
          aria-label={`OTP digit ${idx + 1}`}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default OtpInput; 