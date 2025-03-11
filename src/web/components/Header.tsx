const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/teacup-logo.svg" alt="TEABOX Logo" className="logo" />
        <span className="header-title">TEABOX</span>
      </div>

      <nav className="header-right">
        <a href="#">RECOMMENDATIONS</a>
        <a href="#">PREFERENCES</a>
        <a href="#">LOGOUT</a>
        <a href="#">---→</a>
      </nav>
    </header>
  );
};

export default Header;
