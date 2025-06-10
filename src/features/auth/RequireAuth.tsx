import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentToken, selectCurrentRoles } from "./authSlice";

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const token = useAppSelector(selectCurrentToken);
  const roles = useAppSelector(selectCurrentRoles);
  const location = useLocation();

  const hasRequiredRole = roles?.find((role) => allowedRoles.includes(role));

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
