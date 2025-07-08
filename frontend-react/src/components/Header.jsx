import React from 'react';
import Button from './Button';

const Header = () => {
  return (
    <>
      <nav className='navbar container pt-3 pb-3 align-items-start'>
        <a className="navbar-brand text-light" href=''>Stock Prediction Portal</a>
        <div>
          <Button text="Login" classType="btn-outline-info"/>
          {/* a space between login and register bottom */}
          &nbsp;
          <Button text="Register" classType="btn-info"/>
        </div>
      </nav>
    </>
    
  );
};

export default Header;