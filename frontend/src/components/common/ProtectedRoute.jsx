import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSkeleton from "./LoadingSkeleton";

export default function ProtectedRoute({ children, allow = ["student"] }) {
  const { role, loading } = useAuth();

  if (loading) return <LoadingSkeleton fullScreen />;

  if (!role || !allow.includes(role)) {
    const isAdminRoute = allow.includes("admin") || allow.includes("super_admin");
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }

  return children;
}
