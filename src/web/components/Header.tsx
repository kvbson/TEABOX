import React from "react";
import arrow from "../../../public/assets/images/Arrow-default.png";
import ArrowRight from "../components/ui/ArrowRight";
import TeacupIcon from "./ui/TeacupIcon";

type HeaderProps = {
  onToggleMenu: () => void;
  menuOpened: boolean;
};

const Header: React.FC<HeaderProps> = ({ onToggleMenu, menuOpened }) => {
  return (
    <header className="header">
      <div className="header-left">
        <TeacupIcon />
        <span className="header-title">TEABOX</span>
      </div>
      <nav className="header-right">
        <a href="#">RECOMMENDATIONS</a>
        <a href="#">PREFERENCES</a>
        <a href="#">LOG OUT</a>
        <button onClick={onToggleMenu} className="arrow-button">
          <ArrowRight
            className={`burger ${!menuOpened ? "menu-hiden" : "menu-opened"}`}
            color="var(--color-primary)"
          />
        </button>
      </nav>
    </header>
  );
};

export default Header;
