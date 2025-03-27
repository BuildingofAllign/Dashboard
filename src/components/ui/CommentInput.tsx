
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface CommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  className?: string;
  authorInitials: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = 'Skriv en kommentar...',
  className = '',
  authorInitials
}) => {
  const [text, setText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`flex items-start gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
        {authorInitials}
      </div>
      <div className="flex-1 relative">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          disabled={!text.trim()}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
};
