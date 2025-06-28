import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Label } from './label';
import { Input } from './input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
  optionsPerPage?: number;
  disabled?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  placeholder,
  options,
  searchable = false,
  searchPlaceholder = "Search options...",
  optionsPerPage = 10,
  disabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(optionsPerPage);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const error = errors[name];

  // Reset visible count when search term changes
  useEffect(() => {
    setVisibleCount(optionsPerPage);
  }, [searchTerm, optionsPerPage]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) {
      return options;
    }
    
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered;
  }, [options, searchTerm, searchable]);

  // Get visible options based on current visible count
  const visibleOptions = useMemo(() => {
    return filteredOptions.slice(0, visibleCount);
  }, [filteredOptions, visibleCount]);

  // Check if there are more options to load
  const hasMoreOptions = visibleCount < filteredOptions.length;

  const handleSelectChange = (value: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(value);
    setSearchTerm(''); // Clear search when option is selected
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling that might close the dropdown
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent keyboard events from affecting the Select component
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // Load more options when scrolled near the bottom (within 50px)
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMoreOptions) {
      setVisibleCount(prev => Math.min(prev + optionsPerPage, filteredOptions.length));
    }
  };

  return (
    <div className="w-full">
      <Label htmlFor={name} className={error ? 'text-red-500' : ''}>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Always include the currently selected value in visible options
          const currentSelectedOption = options.find(option => option.value === field.value);
          const finalVisibleOptions = useMemo(() => {
            if (!currentSelectedOption) return visibleOptions;
            
            const hasSelectedInVisible = visibleOptions.some(option => option.value === field.value);
            if (hasSelectedInVisible) return visibleOptions;
            
            // Add the selected option at the top if it's not in visible results
            return [currentSelectedOption, ...visibleOptions];
          }, [visibleOptions, currentSelectedOption, field.value]);

          return (
            <Select onValueChange={(value) => handleSelectChange(value, field.onChange)} value={field.value} disabled={disabled}>
              <SelectTrigger
                id={name}
                className={`mt-2 rounded-full w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
                disabled={disabled}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="w-full">
                {searchable && !disabled && (
                  <div className="p-2 border-b border-gray-200" onClick={(e) => e.stopPropagation()}>
                    <Input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      className="h-8 rounded-md"
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                )}
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="max-h-60 overflow-y-auto"
                >
                  {finalVisibleOptions.length > 0 ? (
                    <>
                      {finalVisibleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                      {hasMoreOptions && (
                        <div className="p-2 text-xs text-gray-400 text-center border-t">
                          Scroll for more options... ({filteredOptions.length - visibleCount} remaining)
                        </div>
                      )}
                    </>
                  ) : (
                    searchable && searchTerm && (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No options found for "{searchTerm}"
                      </div>
                    )
                  )}
                </div>
              </SelectContent>
            </Select>
          );
        }}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error.message?.toString()}</p>}
    </div>
  );
}; 