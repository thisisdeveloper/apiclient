import React, { useState, useRef, useEffect } from 'react';
import { Edit2 } from 'lucide-react';

interface TabRenameProps {
  title: string;
  onRename: (newTitle: string) => void;
}

export function TabRename({ title, onRename }: TabRenameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedValue = value.trim();
    if (trimmedValue && trimmedValue !== title) {
      onRename(trimmedValue);
    } else {
      setValue(title);
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setValue(title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-1 py-0.5 text-sm bg-white border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Tab name"
        />
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0 group">
      <span className="truncate">{title}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-100 transition-opacity"
      >
        <Edit2 className="h-3 w-3 text-gray-500" />
      </button>
    </div>
  );
}