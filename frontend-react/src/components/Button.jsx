import React from 'react';

const Button = ({text, classType}) => {
  return (
    <>
      <a className={`btn ${classType}`} href='#'>{text}</a>c
    </>
  );
};

export default Button;