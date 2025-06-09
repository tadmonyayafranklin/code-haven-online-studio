
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { File } from '@/pages/Index';

interface TabsProps {
  files: File[];
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
}

export const Tabs = ({ files, activeFileId, onFileSelect, onDeleteFile }: TabsProps) => {
  return (
    <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto">
      {files.map((file) => (
        <div
          key={file.id}
          className={`group flex items-center gap-2 px-4 py-2 border-r border-gray-700 cursor-pointer transition-colors min-w-0 ${
            activeFileId === file.id
              ? 'bg-gray-900 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          }`}
          onClick={() => onFileSelect(file.id)}
        >
          <span className="text-sm truncate max-w-32">{file.name}</span>
          {files.length > 1 && (
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 p-0 h-4 w-4 text-gray-400 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.id);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
