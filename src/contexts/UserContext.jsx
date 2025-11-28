import React, { createContext, useContext, useState, useEffect } from 'react';
// CORRECCIÓN 1: Eliminamos setAuthToken y traemos logoutUser
import { logoutUser } from '../api/usersApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  // Eliminamos el estado 'token', ya no lo manejamos en JS

  useEffect(() => {
    // CORRECCIÓN 2: Al cargar, solo buscamos el userId para restaurar la sesión visual.
    // Ya no buscamos 'authToken' en localStorage.
    const savedUserId = localStorage.getItem('userId');

    if (savedUserId) {
       setUserId(savedUserId);
    }
  }, []);

  // La función login ahora recibe solo el objeto con userId (o lo que mande tu loginUser)
  const login = (userData) => {
    const id = userData.userId || userData.id; // Nos aseguramos de tener el ID
    
    setUserId(id);
    localStorage.setItem('userId', id);
    
    // CORRECCIÓN 3: Eliminadas las llamadas a setToken y setAuthToken
  };

  const logout = async () => {
    // CORRECCIÓN 4: Avisamos al backend para que borre la cookie
    try {
        await logoutUser();
    } catch (error) {
        console.error("Error avisando al backend del logout", error);
    }

    // Limpiamos el estado local
    setUserId(null);
    localStorage.removeItem('userId');
    // localStorage.removeItem('authToken'); // Ya no existe, no hace falta borrarlo
  };

  return (
    <UserContext.Provider
      value={{
        // El objeto user ahora solo tiene lo que podemos ver (userId)
        user: userId ? { userId } : null,
        login,
        logout,
        isAuthenticated: Boolean(userId)
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);