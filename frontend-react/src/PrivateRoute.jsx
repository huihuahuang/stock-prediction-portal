import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? children : <Navigate to="/login" />;
};

// PropTypes validation
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default PrivateRoute;
