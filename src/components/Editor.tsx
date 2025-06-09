
import { useEffect, useRef } from 'react';
import { Code } from 'lucide-react';
import type { File } from '@/pages/Index';

interface EditorProps {
  file: File;
  onContentChange: (content: string) => void;
}

export const Editor = ({ file, onContentChange }: EditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [file.id]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onContentChange(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-700 bg-gray-800">
        <Code className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">
          {file.name}
        </span>
        <span className="text-xs text-gray-500 ml-auto">
          {file.language.toUpperCase()}
        </span>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={file.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-6 resize-none outline-none border-none"
          style={{
            tabSize: 2,
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          placeholder={`Start coding in ${file.language}...`}
          spellCheck={false}
        />
        
        {/* Line numbers overlay */}
        <div className="absolute left-0 top-0 p-4 pointer-events-none select-none">
          <div className="text-gray-600 font-mono text-sm leading-6">
            {file.content.split('\n').map((_, index) => (
              <div key={index} className="text-right w-8">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
        
        {/* Code content with syntax highlighting simulation */}
        <div className="absolute left-12 top-0 p-4 pointer-events-none select-none font-mono text-sm leading-6 text-transparent">
          <div 
            className="whitespace-pre-wrap"
            style={{ color: 'transparent' }}
            dangerouslySetInnerHTML={{ 
              __html: file.content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/(function|const|let|var|if|else|for|while|return|class|import|export|from)/g, 
                  '<span style="color: #569cd6;">$1</span>')
                .replace(/('[^']*'|"[^"]*")/g, 
                  '<span style="color: #ce9178;">$1</span>')
                .replace(/(\/\/.*$)/gm, 
                  '<span style="color: #6a9955;">$1</span>')
                .replace(/(console\.log|document\.|window\.)/g, 
                  '<span style="color: #4ec9b0;">$1</span>')
                .replace(/(\d+)/g, 
                  '<span style="color: #b5cea8;">$1</span>')
            }}
          />
        </div>
      </div>
    </div>
  );
};
