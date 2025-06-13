import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentToken, selectCurrentRoles } from "./authSlice";

interface RequireAuthProps {
  allowedRoles?: string[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const token = useAppSelector(selectCurrentToken);
  const roles = useAppSelector(selectCurrentRoles);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = roles?.some(role => allowedRoles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default RequireAuth;
