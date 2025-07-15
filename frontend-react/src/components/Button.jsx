import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Button = ({ text, classType, direction }) => {
  return (
    <>
      <Link className={`btn ${classType}`} to={direction}>
        {text}
      </Link>
    </>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  classType: PropTypes.string,
  direction: PropTypes.string.isRequired,
};
export default Button;
