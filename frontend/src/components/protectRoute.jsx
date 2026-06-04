import { Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;
