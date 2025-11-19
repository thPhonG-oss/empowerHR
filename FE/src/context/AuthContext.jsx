// src/contexts/AuthContext.jsx
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // Login đúng cách
  // // Login: lưu token + decode roles
  // const login = (token) => {
  //   localStorage.setItem("token", token);
  //   setToken(token);

  //   try {
  //     // jwt(token) là cách gọi với phiên bản mới
  //     const decoded = jwtDecode(token);

  //     const rolesFromToken = decoded.roles || [];
  //     localStorage.setItem("roles", JSON.stringify(rolesFromToken));
  //     setRole(rolesFromToken);
  //   } catch (err) {
  //     console.error("Invalid token", err);
  //     setRole([]);
  //   }
  // };

  // Fake login
  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setRole(role);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole("");
  };

  // Check login status
  const isLoggedIn = !!token;

  // Check role
  const hasRole = (r) => role === r;

  return (
    <AuthContext.Provider
      value={{ token, role, login, logout, isLoggedIn, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}
