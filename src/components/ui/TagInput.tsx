
import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Tilføj tag...',
  maxTags = Infinity,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmedInput = inputValue.trim();
    
    if (trimmedInput && !value.includes(trimmedInput) && value.length < maxTags) {
      onChange([...value, trimmedInput]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800"
          >
            <span>{tag}</span>
            <button 
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-gray-200 rounded-full h-4 w-4 inline-flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length < maxTags ? placeholder : `Maksimum ${maxTags} tags nået`}
          disabled={value.length >= maxTags}
          className="rounded-r-none"
        />
        <Button 
          type="button"
          onClick={addTag} 
          disabled={!inputValue.trim() || value.length >= maxTags}
          className="rounded-l-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
