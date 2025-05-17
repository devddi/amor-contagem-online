
import React from 'react';
import { cn } from '@/lib/utils';

interface OptionSelectorProps {
  options: {
    title: string;
    description: string;
    price: string;
  }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedIndex, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {options.map((option, index) => (
        <button
          key={index}
          className={cn(
            "p-4 rounded-lg border border-gray-200 text-left transition-all",
            selectedIndex === index 
              ? "border-love-500 bg-love-50 shadow-sm" 
              : "hover:border-love-200"
          )}
          onClick={() => onSelect(index)}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{option.title}</p>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            <span className="text-love-600 font-semibold">{option.price}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;
