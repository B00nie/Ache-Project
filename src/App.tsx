import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PackagingAnalysis from './pages/PackagingAnalysis';
import ChatbotProvider from './contexts/ChatbotContext';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <AuthProvider>
      <ChatbotProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analise-embalagens"
              element={
                <ProtectedRoute>
                  <PackagingAnalysis />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <ChatbotWidget />
        </Router>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;