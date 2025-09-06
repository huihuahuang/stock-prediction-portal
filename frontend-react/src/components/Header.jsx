import React, { useContext } from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    navigate('/login');
  };
  return (
    <>
      <nav className="navbar container pt-3 pb-3 align-items-start">
        <Link className="navbar-brand text-light" to="/">
          Stock Prediction Portal
        </Link>
        <div>
          {isLoggedIn ? (
            <button className="btn btn-danger" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <>
              <Button
                text="Login"
                classType="btn-outline-info"
                direction="/login"
              />
              {/* a space between login and register bottom */}
              &nbsp;
              <Button
                text="Register"
                classType="btn-info"
                direction="/register"
              />
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
