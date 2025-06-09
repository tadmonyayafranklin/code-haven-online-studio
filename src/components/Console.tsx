
import { useEffect, useRef } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsoleProps {
  output: string[];
}

export const Console = ({ output }: ConsoleProps) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="h-full bg-gray-950 flex flex-col border-t border-gray-700">
      {/* Console Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300">Console</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-gray-100 p-1 h-6"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Console Output */}
      <div 
        ref={consoleRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-sm"
      >
        {output.length === 0 ? (
          <div className="text-gray-500 italic">Console output will appear here...</div>
        ) : (
          <div className="space-y-1">
            {output.map((line, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-500 text-xs mt-0.5 select-none">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <span className="text-gray-100 flex-1">{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Console Input */}
      <div className="border-t border-gray-700 p-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-400">{'>'}</span>
          <span className="text-gray-500 italic">Interactive console coming soon...</span>
        </div>
      </div>
    </div>
  );
};
