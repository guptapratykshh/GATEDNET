import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import Button from '../components/UI/Button';
import useStore from '../store/useStore';

const Login = () => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const { login, isLoading, error } = useStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
        <div className="p-6 bg-navy-900 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold">GREENLANDS SOCIETY</h2>
          <p className="mt-2 text-blue-200">Resident Portal</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>For demo, use:</p>
              <p>Email: demo@example.com</p>
              <p>Password: password</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;