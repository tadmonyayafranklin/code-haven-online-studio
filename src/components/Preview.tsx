
import { useEffect, useRef, useState } from 'react';
import { Eye, RefreshCw, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { File } from '@/pages/Index';

interface PreviewProps {
  files: File[];
}

export const Preview = ({ files }: PreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPreview = () => {
    setIsRefreshing(true);
    updatePreview();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const htmlFile = files.find(f => f.language === 'html' || f.name.endsWith('.html'));
    const cssFiles = files.filter(f => f.language === 'css' || f.name.endsWith('.css'));
    const jsFiles = files.filter(f => f.language === 'javascript' || f.name.endsWith('.js'));

    let htmlContent = htmlFile?.content || `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
      </head>
      <body>
          <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0f0f0; font-family: Arial, sans-serif;">
              <div style="text-align: center; color: #666;">
                  <h2>No HTML file found</h2>
                  <p>Create an HTML file to see the preview</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Inject CSS
    if (cssFiles.length > 0) {
      const cssContent = cssFiles.map(f => f.content).join('\n');
      const styleTag = `<style>${cssContent}</style>`;
      
      if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `${styleTag}</head>`);
      } else {
        htmlContent = styleTag + htmlContent;
      }
    }

    // Inject JavaScript
    if (jsFiles.length > 0) {
      const jsContent = jsFiles.map(f => f.content).join('\n');
      const scriptTag = `<script>${jsContent}</script>`;
      
      if (htmlContent.includes('</body>')) {
        htmlContent = htmlContent.replace('</body>', `${scriptTag}</body>`);
      } else {
        htmlContent = htmlContent + scriptTag;
      }
    }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
  };

  useEffect(() => {
    updatePreview();
  }, [files]);

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-gray-300">Live Preview</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={refreshPreview}
          disabled={isRefreshing}
          className="text-gray-400 hover:text-gray-100"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none bg-white"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
        
        {/* Device frame overlay */}
        <div className="absolute top-2 right-2 bg-gray-800 rounded-md p-2 opacity-75">
          <Monitor className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
