import React from 'react';
import logo from '../../../public/assets/images/teacup-default.png';
import arrow from '../../../public/assets/images/Arrow-default.png';
import burger from '../../../public/assets/images/burgerMenu.svg';

type HeaderProps = {
  onToggleMenu: () => void;
  menuOpened: boolean;
};

const Header: React.FC<HeaderProps> = ({ onToggleMenu, menuOpened }) => {
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
        <button><img src={arrow} alt="menu" className={`burger ${!menuOpened ? "menu-hiden" : "menu-opened"}`} onClick={onToggleMenu}></img></button>
      </nav>
    </header>
  );
};

export default Header;