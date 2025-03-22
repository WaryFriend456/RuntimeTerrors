import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/views/Navbar'
import LoginSignup from '@/components/views/LoginSignup'
import { ThemeProvider } from "./components/ui/theme-provider"
import { AnimatedPage } from "./components/motion/animated-page"
import { AnimatePresence } from "framer-motion"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/views/Dashboard';
import Profile from './components/views/Profile';
import About from './components/views/About';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginSignup />} />
              <Route path="/about" element={<About />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Redirect root to dashboard or login based on auth status */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all - redirect to dashboard or login */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
