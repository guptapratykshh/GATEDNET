import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { Building2 } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <Building2 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-indigo-600 mb-4">GatedNet</h1>
                  <p className="text-gray-600 mb-6">
                    A hyperlocal platform for gated communities
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="/login"
                      className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                    >
                      Log In
                    </a>
                    <a
                      href="/register"
                      className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                    >
                      Register
                    </a>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;