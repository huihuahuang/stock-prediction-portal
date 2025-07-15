import React from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <nav className="navbar container pt-3 pb-3 align-items-start">
        <Link className="navbar-brand text-light" to="/">
          Stock Prediction Portal
        </Link>
        <div>
          <Button
            text="Login"
            classType="btn-outline-info"
            direction="/login"
          />
          {/* a space between login and register bottom */}
          &nbsp;
          <Button text="Register" classType="btn-info" direction="/register" />
        </div>
      </nav>
    </>
  );
};

export default Header;
