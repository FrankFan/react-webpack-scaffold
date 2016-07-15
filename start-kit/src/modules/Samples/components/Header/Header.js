import React from 'react';

const Header = () =>
  (<div className="Header">
    <p>uuuuu</p>
    <img src={require('./lu.jpg')} alt="lu logo" />
    <div className="Header-container">
      <div className="Header-back"></div>
      <div className="Header-search"></div>
      <div className="Header-menu"></div>
    </div>
  </div>);

export default Header;
