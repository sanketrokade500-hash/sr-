import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  label?: string;
  options: (DropdownOption | string)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  error?: string;
  disabled?: boolean;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  otherPlaceholder?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  id,
  error,
  disabled = false,
  allowOther = false,
  otherValue = '',
  onOtherChange,
  otherPlaceholder = 'Enter custom value...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options
  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Check if current value is "Other" or a custom value not in standard options
  const isPreset = normalizedOptions.some((opt) => opt.value === value);
  const isOtherSelected = allowOther && (!isPreset || value === 'Other');

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  return (
    <div className="space-y-1.5 w-full relative" ref={containerRef} id={id ? `${id}-container` : undefined}>
      {label && (
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>{label}</span>
          {isOtherSelected && <span className="text-[10px] text-amber-400 font-normal">Custom input active</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          id={id || 'custom-dropdown-btn'}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full min-h-[42px] px-3.5 py-2.5 rounded-xl text-left text-sm flex items-center justify-between transition border ${
            isOpen
              ? 'bg-[#1D2235] border-amber-400 ring-2 ring-amber-400/20 text-slate-100'
              : 'bg-[#161926] border-slate-700/80 text-slate-100 hover:border-slate-500 hover:bg-[#1A1F30]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
            <span className="font-medium truncate text-slate-100">
              {selectedOption ? selectedOption.label : isOtherSelected && otherValue ? otherValue : value || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {selectedOption?.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {selectedOption.badge}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-amber-400' : ''
              }`}
            />
          </div>
        </button>

        {/* Floating Menu Popover */}
        {isOpen && (
          <div
            className="absolute z-50 left-0 right-0 mt-1.5 bg-[#121522] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div className="p-1.5 space-y-1" role="listbox">
              {normalizedOptions.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-200 hover:bg-[#1C2136] hover:text-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span>{opt.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {opt.badge && !isSelected && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-black shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Conditional "Other" custom text input */}
      {allowOther && isOtherSelected && (
        <div className="pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
          <input
            type="text"
            required
            value={otherValue}
            onChange={(e) => {
              if (onOtherChange) onOtherChange(e.target.value);
            }}
            placeholder={otherPlaceholder}
            className="w-full bg-[#181C2C] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-amber-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
      )}

      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
