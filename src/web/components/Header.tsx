import React from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link
import ArrowRight from '../components/ui/ArrowRight';
import TeacupIcon from './ui/TeacupIcon';

type HeaderProps = {
  onToggleMenu: () => void;
  sidebarOpened: boolean;
};

const Header: React.FC<HeaderProps> = ({ onToggleMenu, sidebarOpened }) => {
  return (
    <header className="header">
      <div className="header-left">
        <TeacupIcon />
        <span className="header-title">TEABOX</span>
      </div>
      <nav className="header-right">
        <Link to="/user/recommendations">RECOMMENDATIONS</Link>
        <Link to="/user/preferences">PREFERENCES</Link>
        <Link to="/logout">LOG OUT</Link>
        <button onClick={onToggleMenu} className="arrow-button">
          <ArrowRight
            className={`burger ${!sidebarOpened ? 'menu-hiden' : 'menu-opened'}`}
            color="var(--color-primary)"
          />
        </button>
      </nav>
    </header>
  );
};

export default Header;
