
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { File } from '@/pages/Index';

interface Project {
  id: string;
  name: string;
  description: string;
  user_id: string;
  is_public: boolean;
  created_at: string;
}

export const useProject = (projectId: string | null) => {
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    setLoading(true);
    try {
      // Load project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Load project files
      const { data: filesData, error: filesError } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: true });

      if (filesError) throw filesError;
      
      const formattedFiles: File[] = filesData.map(file => ({
        id: file.id,
        name: file.name,
        content: file.content || '',
        language: file.language,
        path: file.path
      }));

      setFiles(formattedFiles);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async (fileId: string, content: string) => {
    if (!projectId) return;

    try {
      const { error } = await supabase
        .from('project_files')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const createFile = async (name: string, language: string) => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('project_files')
        .insert([{
          project_id: projectId,
          name,
          content: '',
          language,
          path: name
        }])
        .select()
        .single();

      if (error) throw error;

      const newFile: File = {
        id: data.id,
        name: data.name,
        content: data.content || '',
        language: data.language,
        path: data.path
      };

      setFiles(prev => [...prev, newFile]);
      return newFile;
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!projectId) return;

    try {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const updateFileContent = (fileId: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, content } : file
    ));
  };

  return {
    project,
    files,
    loading,
    saveFile,
    createFile,
    deleteFile,
    updateFileContent
  };
};
