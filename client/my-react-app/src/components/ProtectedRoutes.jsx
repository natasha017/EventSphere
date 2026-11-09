import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({ allowedRoles = ["admin"] }) => {
  const { user, isInitialized } = useSelector(
    (state) => state.auth
  );

  if (!isInitialized) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.trim().toLowerCase();

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;