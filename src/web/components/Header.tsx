import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowRight from '../components/ui/ArrowRight';
import TeacupIcon from './ui/TeacupIcon';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  onToggleMenu: () => void;
  sidebarOpened: boolean;
  onLogout: () => void;
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
  const handleLogout = () => {
    onLogout(); // reset stanu logowania
    navigate('/'); // przejście na LoginPage
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
          <Link to="/" onClick={handleLogout}>LOG OUT</Link>

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
