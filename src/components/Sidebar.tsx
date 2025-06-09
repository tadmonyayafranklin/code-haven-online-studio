
import { useState } from 'react';
import { File, Folder, Plus, Trash2, Code, FileText, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { File as FileType } from '@/pages/Index';

interface SidebarProps {
  files: FileType[];
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
  onCreateFile: (name: string, language: string) => void;
  onDeleteFile: (fileId: string) => void;
}

export const Sidebar = ({ files, activeFileId, onFileSelect, onCreateFile, onDeleteFile }: SidebarProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('javascript');

  const getFileIcon = (language: string) => {
    switch (language) {
      case 'html': return <FileText className="w-4 h-4 text-orange-400" />;
      case 'css': return <Palette className="w-4 h-4 text-blue-400" />;
      case 'javascript': return <Code className="w-4 h-4 text-yellow-400" />;
      default: return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim(), newFileLanguage);
      setNewFileName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Explorer
          </h2>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-100">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-100">Create New File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    File Name
                  </label>
                  <Input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="filename.js"
                    className="bg-gray-700 border-gray-600 text-gray-100"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Language
                  </label>
                  <Select value={newFileLanguage} onValueChange={setNewFileLanguage}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateFile} className="flex-1">
                    Create
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreating(false)}
                    className="flex-1 border-gray-600 text-gray-300 hover:text-gray-100"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {files.map((file) => (
            <div
              key={file.id}
              className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                activeFileId === file.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
              }`}
              onClick={() => onFileSelect(file.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(file.language)}
                <span className="truncate text-sm">{file.name}</span>
              </div>
              {files.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 p-1 h-auto text-gray-400 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          Code Haven IDE
        </div>
      </div>
    </div>
  );
};
