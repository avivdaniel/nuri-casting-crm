import React from "react";
import "./AppLoader.scss";

export const AppLoader = () => {
  return (
    <div className="AppLoader">
      <div className="loader">
        <div className="spinner yellow"></div>
        <div className="spinner orange"></div>
        <div className="spinner red"></div>
        <div className="spinner pink"></div>
        <div className="spinner violet"></div>
        <div className="spinner mauve"></div>
        <div className="spinner light-yellow"></div>
      </div>
      <span className="Apploader-brandeName">Nuri Casting</span>
    </div>
  );
};
