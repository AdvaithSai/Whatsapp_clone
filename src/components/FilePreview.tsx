import React from 'react';
import { X } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
      <button
        onClick={onRemove}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}