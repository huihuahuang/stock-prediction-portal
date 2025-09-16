import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return !isLoggedIn ? children : <Navigate to="/dashboard" />;
};
// PropTypes validation
PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default PublicRoute;
