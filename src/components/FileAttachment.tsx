import React from 'react';
import { FileText, Image, File } from 'lucide-react';

interface FileAttachmentProps {
  file: {
    name: string;
    url: string;
    type: string;
  };
}

export default function FileAttachment({ file }: FileAttachmentProps) {
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  
  if (isImage) {
    return (
      <div className="max-w-[300px]">
        <img 
          src={file.url} 
          alt={file.name}
          className="rounded-lg w-full h-auto mb-2" 
        />
        <div className="flex items-center text-sm text-gray-500">
          <Image className="w-4 h-4 mr-1" />
          <span className="truncate">{file.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-3 max-w-[300px]">
      {isPDF ? (
        <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
      ) : (
        <File className="w-8 h-8 text-blue-500 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {file.type}
        </p>
      </div>
      <a
        href={file.url}
        download={file.name}
        className="text-sm text-blue-500 hover:text-blue-700"
      >
        Download
      </a>
    </div>
  );
}