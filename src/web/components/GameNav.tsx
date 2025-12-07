// src/components/GameNav.tsx
import React from 'react';
import ArrowDivider from './ui/ArrowDivider';
import '../css/gameNav.css';

interface GameNavProps {
  currentUserId: number;
  steamapp_id: number;
  className: string;
  title?: string;
  onPrev: () => void;
  onNext: () => void;
  handleBanGame: ({ currentUserId, steamapp_id }: {
  currentUserId: number;
  steamapp_id: number;
  }) => Promise<void>
}

const GameNav: React.FC<GameNavProps> = ({ currentUserId, steamapp_id, title, onPrev, onNext, className, handleBanGame }) => {

  const onBan = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleBanGame({ currentUserId, steamapp_id });
  };
  return (
    <div className={`game-nav ${className}`}>
      <button className="nav-button" onClick={onPrev}>
         PREV GAME
        <ArrowDivider className='underlined left'/>
      </button>
      {title && (
        <h1 className="game-title">
          {title}
          <button
            /*TODO: Dodać progress i komunikat**/
            onClick={onBan}
            style={{ background: 'unset', border: 'unset', cursor: 'pointer' }}
            className="game-title">

            🚫
          </button>
        </h1>
      )}
      <button className="nav-button" onClick={onNext}>
        NEXT GAME
        <ArrowDivider className='underlined right'/>
      </button>
    </div>
  );
};

export default GameNav;