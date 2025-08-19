import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from './input';
import { Label } from './label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  customError?: any;
}

export const FormInput: React.FC<FormInputProps> = ({ name, label, customError, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] || customError;
  return (
    <div className="w-full">
      <Label htmlFor={name} className={error ? '' : ''}>
        {label}
      </Label>
      <Input
        id={name}
        {...register(name)}
        {...props}
        className={`mt-2 rounded-full ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-2">{error.message?.toString()}</p>
      )}
    </div>
  );
}; 