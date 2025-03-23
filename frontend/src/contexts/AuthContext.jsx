import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// API base URL - remove /api since we'll include that in individual requests
const API_BASE_URL = 'http://localhost:3000'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = API_BASE_URL;

  useEffect(() => {
    // Check if token exists in localStorage on initial load
    const checkToken = async () => {
      try {
        if (token) {
          // Use axios instead of fetch for consistency
          const response = await axios.get('/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            setUser(response.data);
          } else {
            // If token is invalid, clear it
            logout();
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { 
        email, 
        password 
      });

      // Save token and user data (including interests)
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your server connection.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password
      });

      // Save token and user data (including interests)
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please check your server connection.' 
      };
    }
  };

  const updateUserInterests = async (interests) => {
    try {
      const response = await axios.put('/api/auth/user/interests', 
        { interests }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update the user object with new interests
      setUser(prev => ({
        ...prev,
        interests: response.data.interests
      }));
      
      return response.data;
    } catch (error) {
      console.error('Error updating interests:', error);
      throw error;
    }
  };

  const logout = () => {
    // Remove token from localStorage and state
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserInterests }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
