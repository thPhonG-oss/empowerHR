import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);

  // Nếu chưa có token thì chuyển về Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
