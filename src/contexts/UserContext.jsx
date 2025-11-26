import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken } from '../api/usersApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUserId = localStorage.getItem('userId');

    if (savedToken && savedUserId) {
      Promise.resolve().then(() => {
        const clean = savedToken.replace(/^Bearer\s+/i, "");
        setAuthToken(clean);
        setToken(clean);
        setUserId(savedUserId);
      });
    }
  }, []);

  const login = ({ token, userId }) => {
    const cleanToken = token.replace(/^Bearer\s+/i, "");

    setToken(cleanToken);
    setUserId(userId);
    setAuthToken(cleanToken);

    localStorage.setItem('authToken', cleanToken);
    localStorage.setItem('userId', userId);
  };


  const logout = () => {
    setToken(null);
    setUserId(null);
    setAuthToken(null);

    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  };

  return (
    <UserContext.Provider
      value={{
        user: token
          ? {
              token,
              userId
            }
          : null,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
