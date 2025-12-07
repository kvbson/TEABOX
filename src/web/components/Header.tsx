import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArrowRight from '../components/ui/ArrowRight';
import TeacupIcon from './ui/TeacupIcon';

type HeaderProps = {
  onToggleMenu: () => void;
  sidebarOpened: boolean;
  onLogout: () => Promise<void> | void;
};

const Header: React.FC<HeaderProps> = ({
  onLogout,
  onToggleMenu,
  sidebarOpened,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout(); // wykonaj logout
    navigate('/login', { replace: true }); // przekierowanie po wylogowaniu
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="header-left">
          <TeacupIcon />
          <span className="header-title">TEABOX</span>
        </Link>

        <nav className="header-right">
          <Link to="/user/recommendations">RECOMMENDATIONS</Link>
          <Link to="/user/preferences">PREFERENCES</Link>
          <Link to="/user/statistics">STATISTICS</Link>
          <Link to="/user/bannedGames">BANNED GAMES</Link>
          <a onClick={handleLogout} className='header-right a' style={{ cursor: 'pointer' }}>
            LOGOUT
          </a>

          <button onClick={onToggleMenu} className="arrow-button">
            <ArrowRight
              className={`burger ${
                !sidebarOpened ? 'menu-hiden' : 'menu-opened'
              }`}
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
            <Link to="/user/statistics" onClick={toggleMobileMenu}>
              STATISTICS
            </Link>
            <Link to="/user/bannedGames" onClick={toggleMobileMenu}>
              BANNED GAMES
            </Link>
            <a onClick={handleLogout} className='mobile-menu-content a'>
            LOGOUT
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
