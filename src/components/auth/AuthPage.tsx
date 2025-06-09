
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, Loader2 } from 'lucide-react';

export const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await signUp(signUpData.email, signUpData.password, {
      full_name: signUpData.fullName,
      username: signUpData.username
    });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for confirmation link!');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code className="w-8 h-8 text-blue-400" />
            <CardTitle className="text-2xl font-bold text-white">CodeHaven</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Sign in to your coding environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="signin" className="text-gray-300 data-[state=active]:text-white">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-gray-300 data-[state=active]:text-white">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4 bg-red-900 border-red-700">
              <AlertDescription className="text-red-100">{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mt-4 bg-blue-900 border-blue-700">
              <AlertDescription className="text-blue-100">{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
