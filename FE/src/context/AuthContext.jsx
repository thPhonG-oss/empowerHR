// src/contexts/AuthContext.jsx
import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  // Login đúng cách
  // Login: lưu token + decode roles
  const login = (token) => {
    localStorage.setItem("token", token);
    console.log(token);
    setToken(token);

    try {
      // jwt(token) là cách gọi với phiên bản mới
      const decoded = jwtDecode(token);
      console.log(decoded);
      const rolesFromToken = decoded.scope || [];
      const role = rolesFromToken.split(" ")[0];
      console.log(role); // ROLE_ADMIN
    } catch (err) {
      console.error("Invalid token", err);
      setRole([]);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole("");
    setUserName("");
  };

  // Check login status
  const isLoggedIn = !!token;

  // Check role
  const hasRole = (r) => role === r;

  return (
    <AuthContext.Provider
      value={{ token, role, userName, login, logout, isLoggedIn, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}
