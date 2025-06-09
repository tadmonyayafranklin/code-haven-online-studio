
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Code, Calendar, User, LogOut, Folder } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  is_public: boolean;
}

interface ProjectDashboardProps {
  onProjectSelect: (projectId: string) => void;
}

export const ProjectDashboard = ({ onProjectSelect }: ProjectDashboardProps) => {
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const createProject = async () => {
    if (!newProject.name.trim()) return;

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: newProject.name,
        description: newProject.description,
        user_id: user?.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
    } else {
      // Create default files for the new project
      await supabase.from('project_files').insert([
        {
          project_id: data.id,
          name: 'index.html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newProject.name}</title>
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
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ${newProject.name}</h1>
        <p>Start coding and see your changes live!</p>
    </div>
</body>
</html>`,
          language: 'html',
          path: 'index.html'
        },
        {
          project_id: data.id,
          name: 'script.js',
          content: `// Welcome to ${newProject.name}!
console.log("Project ${newProject.name} is ready!");

// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM is ready!");
});`,
          language: 'javascript',
          path: 'script.js'
        }
      ]);

      setProjects(prev => [data, ...prev]);
      setNewProject({ name: '', description: '' });
      setIsCreating(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    onProjectSelect(projectId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">CodeHaven IDE</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Projects</h2>
            <p className="text-gray-400">Create and manage your coding projects</p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Project Name
                  </label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Awesome Project"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createProject} className="flex-1">
                    Create Project
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreating(false)}
                    className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Create your first project to get started</p>
            <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    {project.name}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="text-gray-400">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
