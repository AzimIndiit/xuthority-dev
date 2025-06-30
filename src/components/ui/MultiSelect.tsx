import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Badge } from './badge';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Separator } from './separator';
import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from "class-variance-authority";
import { WandSparkles } from "lucide-react";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  name: string;
  label: string;
  options: MultiSelectOption[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  name,
  label,
  options,
  placeholder = 'Select...',
  disabled = false,
  maxCount = 3,
  animation = 0,
  modalPopover = false,
  asChild = false,
  className,
  ...props
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="w-full">
      <Label htmlFor={name} className={error ? 'text-red-500' : ''}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];
          const setSelectedValues = (vals: string[]) => field.onChange(vals);
          const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
          const [isAnimating, setIsAnimating] = React.useState(false);
          const [search, setSearch] = React.useState('');

          const filteredOptions = React.useMemo(() => {
            if (!search.trim()) return options;
            return options.filter(option =>
              option.label.toLowerCase().includes(search.toLowerCase()) ||
              option.value.toLowerCase().includes(search.toLowerCase())
            );
          }, [search, options]);

          const toggleOption = (value: string) => {
            if (selectedValues.includes(value)) {
              setSelectedValues(selectedValues.filter(v => v !== value));
            } else {
              setSelectedValues([...selectedValues, value]);
            }
          };

          const handleClear = () => setSelectedValues([]);

          const handleTogglePopover = () => {
            setIsPopoverOpen((prev) => !prev);
          };

          const clearExtraOptions = () => {
            const newSelectedValues = selectedValues.slice(0, maxCount);
            setSelectedValues(newSelectedValues);
          };

          const toggleAll = (event: any) => {
            event.preventDefault();
            if (selectedValues.length === options.length) {
              handleClear();
            } else {
              const allValues = options.map((option) => option.value);
              setSelectedValues(allValues);
            }
          };

          return (
            <Popover
              open={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              modal={modalPopover}
            >
              <PopoverTrigger asChild>
                <Button
                  {...props}
                  onClick={handleTogglePopover}
                  className={cn(
                    'flex w-full p-1 rounded-full h-14 border  items-center justify-between bg-inherit hover:bg-inherit mt-2',
                    className
                  )}
                  disabled={disabled}
                >
                  {selectedValues.length > 0 ? (
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-wrap items-center w-full">
                        {selectedValues.slice(0, maxCount).map((value) => {
                          const option = options.find((o) => o.value === value);
                          const IconComponent = option?.icon;
                          return (
                            <Badge
                              key={value}
                              className={cn(
                                isAnimating ? "animate-bounce" : "",
                                multiSelectVariants({ variant: props.variant })
                              )}
                              style={{ animationDuration: `${animation}s` }}
                            >
                              {IconComponent && (
                                <IconComponent className="h-4 w-4 mr-2" />
                              )}
                              {option?.label}
                              <XCircle
                                className="ml-2 h-4 w-4 cursor-pointer"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleOption(value);
                                }}
                              />
                            </Badge>
                          );
                        })}
                        {selectedValues.length > maxCount && (
                          <Badge
                            className={cn(
                              "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                              isAnimating ? "animate-bounce" : "",
                              multiSelectVariants({ variant: props.variant })
                            )}
                            style={{ animationDuration: `${animation}s` }}
                          >
                            {`+ ${selectedValues.length - maxCount} more`}
                            <XCircle
                              className="ml-2 h-4 w-4 cursor-pointer"
                              onClick={(event) => {
                                event.stopPropagation();
                                clearExtraOptions();
                              }}
                            />
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <XIcon
                          className="h-4 mx-2 cursor-pointer text-muted-foreground"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClear();
                          }}
                        />
                        <Separator
                          orientation="vertical"
                          className="flex min-h-6 h-full"
                        />
                        <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full mx-auto">
                      <span className="text-sm text-muted-foreground mx-3">
                        {placeholder}
                      </span>
                      <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                onEscapeKeyDown={() => setIsPopoverOpen(false)}
              >
                <Command>
                  <CommandInput
                    placeholder="Search..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        key="all"
                        onSelect={toggleAll}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedValues.length === options.length
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        <span>(Select All)</span>
                      </CommandItem>
                      {filteredOptions.map(option => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={(event: any) => {
                              event.preventDefault();
                              toggleOption(option.value);
                            }}
                            className="cursor-pointer w-full"
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </div>
                            {option.icon && (
                              <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                            )}
                            <span>{option.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <div className="flex items-center justify-between">
                        {selectedValues.length > 0 && (
                          <CommandItem
                            onSelect={(event: any) => {
                              event.preventDefault();
                              handleClear();
                            }}
                            className="flex-1 justify-center cursor-pointer w-full"
                          >
                            Clear
                          </CommandItem>
                        )}
                        <CommandItem
                          onSelect={(event: any) => {
                            event.preventDefault();
                            setIsPopoverOpen(false);
                          }}
                          className="flex-1 justify-center cursor-pointer max-w-full"
                        >
                          Close
                        </CommandItem>
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
              {animation > 0 && selectedValues.length > 0 && (
                <WandSparkles
                  className={cn(
                    "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
                    isAnimating ? "" : "text-muted-foreground"
                  )}
                  onClick={() => setIsAnimating(!isAnimating)}
                />
              )}
            </Popover>
          );
        }}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error.message?.toString()}</p>}
    </div>
  );
}; 