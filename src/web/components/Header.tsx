import React from 'react';
import logo from '../../../public/assets/images/teacup-default.png';
import arrow from '../../../public/assets/images/Arrow-default.png'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="TEABOX Logo" className="logo" />
        <span className="header-title">TEABOX</span>
      </div>
      <nav className="header-right">
        <a href="#">RECOMMENDATIONS</a>
        <a href="#">PREFERENCES</a>
        <a href="#">LOG OUT</a>
        <a href="#"><img src={arrow} alt="hide" className='header-arrow'></img></a>
      </nav>
    </header>
  );
};

export default Header;