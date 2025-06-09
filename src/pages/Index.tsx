
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/components/auth/AuthPage';
import { ProjectDashboard } from '@/components/ProjectDashboard';
import { useProject } from '@/hooks/useProject';
import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { Console } from '@/components/Console';
import { Tabs } from '@/components/Tabs';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ArrowLeft, Save } from 'lucide-react';

export interface File {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '🚀 IDE is ready for coding!',
    'Select a project to start coding!'
  ]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { project, files, loading: projectLoading, saveFile, createFile, deleteFile, updateFileContent } = useProject(currentProjectId);

  const activeFile = files.find(f => f.id === activeFileId);

  // Set active file when files load
  useEffect(() => {
    if (files.length > 0 && !activeFileId) {
      setActiveFileId(files[0].id);
    }
  }, [files, activeFileId]);

  const handleProjectSelect = (projectId: string) => {
    setCurrentProjectId(projectId);
    setActiveFileId('');
    setHasUnsavedChanges(false);
  };

  const handleBackToDashboard = () => {
    setCurrentProjectId(null);
    setActiveFileId('');
    setHasUnsavedChanges(false);
  };

  const handleFileContentChange = (content: string) => {
    if (activeFile) {
      updateFileContent(activeFile.id, content);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveFile = async () => {
    if (activeFile && hasUnsavedChanges) {
      await saveFile(activeFile.id, activeFile.content);
      setHasUnsavedChanges(false);
      setConsoleOutput(prev => [...prev, `✅ Saved ${activeFile.name}`]);
    }
  };

  const handleCreateFile = async (name: string, language: string) => {
    const newFile = await createFile(name, language);
    if (newFile) {
      setActiveFileId(newFile.id);
      setConsoleOutput(prev => [...prev, `📄 Created ${name}`]);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    const fileToDelete = files.find(f => f.id === fileId);
    if (files.length === 1) return; // Don't delete the last file
    
    await deleteFile(fileId);
    if (activeFileId === fileId) {
      const remainingFiles = files.filter(f => f.id !== fileId);
      setActiveFileId(remainingFiles[0]?.id || '');
    }
    
    if (fileToDelete) {
      setConsoleOutput(prev => [...prev, `🗑️ Deleted ${fileToDelete.name}`]);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!currentProjectId) {
    return <ProjectDashboard onProjectSelect={handleProjectSelect} />;
  }

  if (projectLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Project Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDashboard}
            className="text-gray-400 hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">{project?.name}</h1>
            {project?.description && (
              <p className="text-sm text-gray-400">{project.description}</p>
            )}
          </div>
        </div>
        <Button
          onClick={handleSaveFile}
          disabled={!hasUnsavedChanges}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          Save {hasUnsavedChanges && '*'}
        </Button>
      </div>

      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Sidebar 
              files={files}
              activeFileId={activeFileId}
              onFileSelect={setActiveFileId}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
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
                onDeleteFile={handleDeleteFile}
              />
              
              <ResizablePanelGroup direction="horizontal" className="flex-1">
                {/* Editor */}
                <ResizablePanel defaultSize={50}>
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      {activeFile && (
                        <Editor
                          file={activeFile}
                          onContentChange={handleFileContentChange}
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
    </div>
  );
};

export default Index;
