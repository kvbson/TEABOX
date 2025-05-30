// src/components/GameNav.tsx
import React from 'react';
import ArrowDivider from './ui/ArrowDivider';
import '../css/gameNav.css';

interface GameNavProps {
  className: string;
  title?: string;
  onPrev: () => void;
  onNext: () => void;
}

const GameNav: React.FC<GameNavProps> = ({ title, onPrev, onNext }) => {
  return (
    <div className="game-nav">
      <button className="nav-button" onClick={onPrev}>
         PREV GAME
        <ArrowDivider className='underlined left'/>
      </button>
      {title && <h1 className="game-title">{title}</h1>}
      <button className="nav-button" onClick={onNext}>
        NEXT GAME
        <ArrowDivider className='underlined right'/>
      </button>
    </div>
  );
};

export default GameNav;