import React, { createContext, useContext, useState, useEffect } from 'react';
// CORRECCIÓN 1: Eliminamos setAuthToken y traemos logoutUser
import { logoutUser } from '../api/usersApi';
import PropTypes from 'prop-types';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);


  useEffect(() => {
    const checkSession = async () => {
      try {
        // Pedimos al backend si la cookie sigue siendo válida
        const res = await fetch("http://localhost:8080/users/auth/me", {
          method: "GET",
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();

          setUserId(data.userId);
          setRole(data.role);

          localStorage.setItem("userId", data.userId);
          localStorage.setItem("role", data.role);
        } else {
          // Sesión inválida → limpiar frontend
          setUserId(null);
          localStorage.removeItem("userId");
        }
      } catch (error) {
        console.error("Error comprobando sesión:", error);
        setUserId(null);
        localStorage.removeItem("userId");
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) setUserId(savedUserId);


    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);

  }, []);

  const login = (userData) => {
      const id = userData.userId || userData.id;
      const r = userData.role;

      setUserId(id);
      setRole(r);

      localStorage.setItem("userId", id);
      localStorage.setItem("role", r);
  };

  const logout = async () => {
    try {
        await logoutUser();
    } catch (error) {
        console.error("Error avisando al backend del logout", error);
    }

    setUserId(null);
    localStorage.removeItem('userId');
    setRole(null);
    localStorage.removeItem("role");

  };

  return (
    <UserContext.Provider
      value={{
        user: userId ? { userId, role } : null,
        login,
        logout,
        isAuthenticated: Boolean(userId), 
        isArtist: role === "artist",
        isUser: role === "user"
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => useContext(UserContext);