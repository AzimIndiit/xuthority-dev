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
import { Badge } from './badge'; // Assuming you have a Badge component
import { X } from 'lucide-react'; // For remove icons

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
  multiple?: boolean;
  maxSelections?: number;
  showSelectAll?: boolean;
  customError?: any;
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
  multiple = false,
  maxSelections,
  showSelectAll = false,
  customError
  
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(optionsPerPage);
  const [isOpen, setIsOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const error = errors[name] || customError;

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

  const handleSingleSelectChange = (value: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(value);
    setSearchTerm(''); // Clear search when option is selected
    setIsOpen(false);
  };

  const handleMultiSelectChange = (value: string, currentValues: string[], fieldOnChange: (value: string[]) => void) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : maxSelections && currentValues.length >= maxSelections
        ? currentValues
        : [...currentValues, value];
    
    fieldOnChange(newValues);
  };

  const handleRemoveSelection = (valueToRemove: string, currentValues: string[], fieldOnChange: (value: string[]) => void) => {
    const newValues = currentValues.filter(v => v !== valueToRemove);
    fieldOnChange(newValues);
  };

  const handleSelectAll = (currentValues: string[], fieldOnChange: (value: string[]) => void) => {
    const allFilteredValues = filteredOptions.map(option => option.value);
    const isAllSelected = allFilteredValues.every(value => currentValues.includes(value));
    
    if (isAllSelected) {
      // Deselect all filtered options
      const newValues = currentValues.filter(value => !allFilteredValues.includes(value));
      fieldOnChange(newValues);
    } else {
      // Select all filtered options (respecting maxSelections)
      const newValues = [...new Set([...currentValues, ...allFilteredValues])];
      if (maxSelections && newValues.length > maxSelections) {
        fieldOnChange(newValues.slice(0, maxSelections));
      } else {
        fieldOnChange(newValues);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMoreOptions) {
      setVisibleCount(prev => Math.min(prev + optionsPerPage, filteredOptions.length));
    }
  };

  const getSelectedLabels = (values: string[] | string): string[] => {
    if (!multiple) return [];
    const valueArray = Array.isArray(values) ? values : [];
    return valueArray.map(value => options.find(option => option.value === value)?.label || value);
  };

  const handleClearAll = (fieldOnChange: (value: string[]) => void) => {
    fieldOnChange([]);
  };

  const renderMultiSelectTrigger = (field: any) => {
    const selectedValues = Array.isArray(field.value) ? field.value : [];
    const selectedLabels = getSelectedLabels(selectedValues);

    if (selectedValues.length === 0) {
      return <span className="text-gray-500">{placeholder}</span>;
    }

    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
      
              {selectedLabels.slice(0, 3).map((label, index) => (
                <Badge
                  key={selectedValues[index]}
                  variant="secondary"
                  className={`text-xs flex items-center gap-1 truncate pr-1 p-2 rounded-full ${selectedValues.length > 3 ? ' max-w-24' : 'max-w-28'}`}
                >
                  <span className="truncate">{label}</span>
                  <button
                    type="button"
                    className="ml-1 p-1.5 hover:bg-red-200 rounded-full transition-colors duration-150 flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveSelection(selectedValues[index], selectedValues, field.onChange);
                    }}
                    tabIndex={-1}
                  >
                    <X size={10} className="text-gray-500 hover:text-red-600" />
                  </button>
                </Badge>
              ))}
              {selectedValues.length > 3 && (
                <Badge variant="outline" className="text-xs p-2 rounded-full">
                  +{selectedValues.length - 3} more
                </Badge>
              )}
    
        
        </div>
        
        {/* Clear All Button */}
        {selectedValues.length > 0 && (
          <button
            type="button"
            className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors duration-150 flex items-center justify-center flex-shrink-0 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClearAll(field.onChange);
            }}
            title="Clear all selections"
            tabIndex={-1}
          >
            <X size={14} className="text-gray-400 hover:text-red-600" />
          </button>
        )}
      </div>
    );
  };


  return (
    <div className="w-full">
      <Label htmlFor={name} className= ''>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentSelectedOption = multiple 
            ? null 
            : options.find(option => option.value === field.value);

          const finalVisibleOptions = useMemo(() => {
            if (multiple) {
              return visibleOptions;
            }
            
            if (!currentSelectedOption) return visibleOptions;
            
            const hasSelectedInVisible = visibleOptions.some(option => option.value === field.value);
            if (hasSelectedInVisible) return visibleOptions;
            
            return [currentSelectedOption, ...visibleOptions];
          }, [visibleOptions, currentSelectedOption, field.value, multiple]);

          if (multiple) {
            return (
              <div className="relative">
                <div
                  ref={field.ref}
                  id={name}
                  className={`mt-2 rounded-full w-full min-h-14 px-3 py-2 border cursor-pointer flex items-center ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}`}
                  onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                  {renderMultiSelectTrigger(field)}
                </div>
                
                {isOpen && !disabled && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {searchable && (
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
                    
                    {showSelectAll && filteredOptions.length > 0 && (
                      <div 
                        className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 text-sm font-medium"
                        onClick={() => handleSelectAll(Array.isArray(field.value) ? field.value : [], field.onChange)}
                      >
                        {filteredOptions.every(option => (Array.isArray(field.value) ? field.value : []).includes(option.value))
                          ? 'Deselect All' : 'Select All'}
                      </div>
                    )}

                    <div 
                      ref={scrollContainerRef}
                      onScroll={handleScroll}
                      className="max-h-60 overflow-y-auto"
                    >
                      {finalVisibleOptions.length > 0 ? (
                        <>
                          {finalVisibleOptions.map(option => {
                            const isSelected = (Array.isArray(field.value) ? field.value : []).includes(option.value);
                            return (
                              <div
                                key={option.value}
                                className={`p-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2 ${
                                  isSelected ? 'bg-blue-50 text-blue-700' : ''
                                }`}
                                onClick={() => handleMultiSelectChange(option.value, Array.isArray(field.value) ? field.value : [], field.onChange)}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // handled by onClick above
                                  className="rounded"
                                />
                                <span className="flex-1">{option.label}</span>
                              </div>
                            );
                          })}
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
                    
                    {maxSelections && (
                      <div className="p-2 border-t border-gray-200 text-xs text-gray-500 text-center">
                        {Array.isArray(field.value) ? field.value.length : 0} of {maxSelections} selected
                      </div>
                    )}
                  </div>
                )}
                
                {/* Backdrop to close dropdown */}
                {isOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                  />
                )}
              </div>
            );
          }

          // Single select mode (original behavior)
          return (
            <Select onValueChange={(value) => handleSingleSelectChange(value, field.onChange)} value={field.value} disabled={disabled}>
              <SelectTrigger
                id={name}
                ref={field.ref}
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
      {error && <p className="text-red-500 text-xs mt-2">{error.message?.toString()}</p>}
    </div>
  );
};