import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";


const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const isAuthenticatedResult = isAuthenticated();
  const location = useLocation();

  return isAuthenticatedResult ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/subscription" replace state={{ from: location }} />
  );
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;