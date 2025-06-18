import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowRight from '../components/ui/ArrowRight';
import TeacupIcon from './ui/TeacupIcon';

type HeaderProps = {
  onToggleMenu: () => void;
  sidebarOpened: boolean;
};

const Header: React.FC<HeaderProps> = ({ onToggleMenu, sidebarOpened }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <TeacupIcon />
          <span className="header-title">TEABOX</span>
        </div>

        <nav className="header-right">
          <Link to="/user/recommendations">RECOMMENDATIONS</Link>
          <Link to="/user/preferences">PREFERENCES</Link>
          <Link to="/user/statistics">STATISTICS</Link>
          <Link to="/logout">LOG OUT</Link>
          {/* Sidebar trigger (zostaje) */}
          <button onClick={onToggleMenu} className="arrow-button">
            <ArrowRight
              className={`burger ${!sidebarOpened ? 'menu-hiden' : 'menu-opened'}`}
              color="var(--color-primary)"
            />
          </button>
          {!mobileMenuOpen ? (
            <button className="hamburger-button" onClick={toggleMobileMenu}>
              ☰
            </button>
          ) : (
            <button className="hamburger-button" onClick={toggleMobileMenu}>
              ✕
            </button>
          )}
        </nav>
      </header>

      {/* MOBILE MENU FULLSCREEN POPUP */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <Link to="/user/recommendations" onClick={toggleMobileMenu}>
              RECOMMENDATIONS
            </Link>
            <Link to="/user/preferences" onClick={toggleMobileMenu}>
              PREFERENCES
            </Link>
            <Link to="/logout" onClick={toggleMobileMenu}>
              LOG OUT
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
