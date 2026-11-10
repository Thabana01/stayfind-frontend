import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('stayfind_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    const formattedUser = {
      id: Number(userData.id), // <-- FORCE AS NUMBER
      name: userData.full_name,
      role: userData.role,
      student_number: userData.student_number, // <-- ADDED
      isVerified: true 
    };
    setUser(formattedUser);
    localStorage.setItem('stayfind_user', JSON.stringify(formattedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stayfind_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};