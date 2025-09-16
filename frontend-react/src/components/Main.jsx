import React from 'react';
import Button from './Button';

const Main = () => {
  return (
    <>
      <div className="container">
        <div className="p-5 text-center bg-light-dark rounded">
          <h1 className="text-light">Stock Prediction Portal</h1>
          <p className="text-light lead">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Consequatur eveniet distinctio cum nobis officia illum sit enim quos
            illo molestias ipsa nihil laudantium adipisci mollitia ipsum
            deleniti, nemo ab quam!
          </p>
          <Button
            text="Explore Now"
            classType="btn-outline-info"
            direction="/dashboard"
          />
        </div>
      </div>
    </>
  );
};

export default Main;
