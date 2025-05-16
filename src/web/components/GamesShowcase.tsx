import React from 'react';
import DOMPurify from 'dompurify';
import GameNav from './GameNav';
import LoadingOverlay from './LoadingOverlay';
import '../css/gamesShowcase.css';

interface GameShowcaseProps {
  appDetails: Record<string, any>;
  isLoading: boolean;
  menuOpened: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const GamesShowcase: React.FC<GameShowcaseProps> = ({
  appDetails,
  isLoading,
  menuOpened,
  onNext,
  onPrev,
}) => {
  const game = appDetails;
  const price = game?.price_overview?.final_formatted ?? 'N/A';

  const sanitizeHTML = (html: string | undefined) => ({
    __html: DOMPurify.sanitize(html || ''),
  });

  return (
    <div className={`recommendations-wrapper ${menuOpened ? 'sidebar-opened' : ''}`}>
      <GameNav
        title={game?.name || 'Loading...'}
        onPrev={onPrev}
        onNext={onNext}
      />

      <div className="game-showcase">
        {isLoading && <LoadingOverlay />}

        <section className="game-showcase__description">
          <h2 className="section-title">Description</h2>
          <p>{game?.short_description || 'No description available'}</p>

          {game?.about_the_game && (
            <div
              className="html-content"
              dangerouslySetInnerHTML={sanitizeHTML(game.about_the_game)}
            />
          )}

          <div className="game-details">
            <p>
              <strong>Released:</strong> {game?.release_date?.date?.toString() ?? 'N/A'}
            </p>
            {game?.metacritic?.score && (
              <p>
                <strong>Metacritic Score:</strong> {game.metacritic.score}
              </p>
            )}
          </div>
        </section>

        <aside className="game-showcase__media">
          <div className="image-container">
            {game?.header_image && (
              <img
                src={game.header_image}
                alt={`Cover art for ${game.name}`}
                loading='eager'
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                }}
              />
            )}
            <div className="price-tag" aria-label="Game price">
              {price}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GamesShowcase;