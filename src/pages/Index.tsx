
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { Console } from '@/components/Console';
import { Tabs } from '@/components/Tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export interface File {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
}

const Index = () => {
  const [files, setFiles] = useState<File[]>([
    {
      id: '1',
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .btn {
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 12px 30px;
            font-size: 1.1rem;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: white;
            color: #667eea;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Code Haven</h1>
        <p>Your online development environment is ready! Start coding and see your changes live.</p>
        <button class="btn" onclick="alert('Hello from your IDE!')">Click Me!</button>
    </div>
</body>
</html>`,
      language: 'html',
      path: 'index.html'
    },
    {
      id: '2',
      name: 'script.js',
      content: `// Welcome to Code Haven IDE!
console.log("🚀 IDE is ready for coding!");

// Example function
function greetUser(name) {
    return \`Hello, \${name}! Welcome to your coding environment.\`;
}

// Demo functionality
const user = "Developer";
console.log(greetUser(user));

// Interactive example
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM is ready!");
    
    // Add some interactivity
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log("🎉 Button clicked!");
        });
    });
});`,
      language: 'javascript',
      path: 'script.js'
    }
  ]);

  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '🚀 IDE is ready for coding!',
    'Hello, Developer! Welcome to your coding environment.',
    '✅ DOM is ready!'
  ]);

  const activeFile = files.find(f => f.id === activeFileId);

  const updateFileContent = (fileId: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, content } : file
    ));
  };

  const createNewFile = (name: string, language: string) => {
    const newFile: File = {
      id: Date.now().toString(),
      name,
      content: '',
      language,
      path: name
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const deleteFile = (fileId: string) => {
    if (files.length === 1) return; // Don't delete the last file
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeFileId === fileId) {
      const remainingFiles = files.filter(f => f.id !== fileId);
      setActiveFileId(remainingFiles[0]?.id || '');
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <Sidebar 
            files={files}
            activeFileId={activeFileId}
            onFileSelect={setActiveFileId}
            onCreateFile={createNewFile}
            onDeleteFile={deleteFile}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Main content area */}
        <ResizablePanel defaultSize={80}>
          <div className="h-full flex flex-col">
            {/* Tabs */}
            <Tabs 
              files={files}
              activeFileId={activeFileId}
              onFileSelect={setActiveFileId}
              onDeleteFile={deleteFile}
            />
            
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              {/* Editor */}
              <ResizablePanel defaultSize={50}>
                <div className="h-full flex flex-col">
                  <div className="flex-1">
                    {activeFile && (
                      <Editor
                        file={activeFile}
                        onContentChange={(content) => updateFileContent(activeFile.id, content)}
                      />
                    )}
                  </div>
                  
                  {/* Console */}
                  <div className="h-40 border-t border-gray-700">
                    <Console output={consoleOutput} />
                  </div>
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Preview */}
              <ResizablePanel defaultSize={50}>
                <Preview files={files} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
