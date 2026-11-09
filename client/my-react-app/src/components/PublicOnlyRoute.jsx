import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicOnlyRoute = () => {
  const { user, isInitialized } = useSelector(
    (state) => state.auth
  );

  if (!isInitialized) {
    return <h2>Loading...</h2>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;