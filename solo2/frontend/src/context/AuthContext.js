import React, { createContext, useState, useEffect } from 'react';

// Create the auth context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    const checkUserLoggedIn = async () => {
      try {
        // Get the user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        // Clear localStorage if there's an error (invalid data)
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = (userData) => {
    // Save the user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    // Remove the user data from localStorage
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;