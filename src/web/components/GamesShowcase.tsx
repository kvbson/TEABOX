import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import GameNav from './GameNav';
import LoadingOverlay from './LoadingOverlay';
import '../css/gamesShowcase.css';
import ScrollToTopButton from './ui/ScrollToTopArror';
// import { BlurImage } from './ui/BlurImage';

interface GameShowcaseProps {
  appDetails: Record<string, any>;
  isLoading: boolean;
  sidebarOpened: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const GamesShowcase: React.FC<GameShowcaseProps> = ({
  appDetails,
  isLoading,
  sidebarOpened,
  onNext,
  onPrev,
}) => {
  const game = appDetails;
  const price = game?.price_overview?.final_formatted ?? 'N/A';

  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!game?.header_image) {
      setIsImageLoading(false);
      return;
    }

    setIsImageLoading(true);
    const img = new Image();
    img.src = game.header_image;

    img.onload = () => {
      if (isMounted) setIsImageLoading(false);
    };

    img.onerror = () => {
      if (isMounted) setIsImageLoading(false);
    };

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [game?.header_image]);

  const sanitizeHTML = (html: string | undefined) => ({
    __html: DOMPurify.sanitize(html || ''),
  });

  return (
    <div className={`recommendations-wrapper ${sidebarOpened ? 'sidebar-opened' : ''}`}>
      <GameNav
        title={game?.name || 'Loading...'}
        onPrev={onPrev}
        onNext={onNext}
      />

      <div className="game-showcase">
        {(isLoading || isImageLoading) && <LoadingOverlay />}

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
            {game?.release_date?.date && (<p>
              <strong>Released:</strong> {new Date(game?.release_date?.date?.toString()).toLocaleDateString('de-DE')}
            </p>)
            }
            {game?.metacritic?.score && (
              <p>
                <strong>Metacritic Score:</strong> {game.metacritic.score}
              </p>
            )}
          </div>
        </section>
        <section>
          {game?.pros?.length > 0 && (
            <section className="game-pros">
              <h3>Pros</h3>
              <ul>
                {game.pros.map((pro: string, i: number) => (
                  <li key={`pro-${i}`}>{pro}</li>
                ))}
              </ul>
            </section>
          )}

          {game?.cons?.length > 0 && (
            <section className="game-cons">
              <h3>Cons</h3>
              <ul>
                {game.cons.map((con: string, i: number) => (
                  <li key={`con-${i}`}>{con}</li>
                ))}
              </ul>
            </section>
          )}
        </section>

        <aside className="game-showcase__media">
          <div className="image-container">
            {/* {game?.blur_image ? BlurImage({ src: game.header_image, blurhash: game.blur_image }) : game.header_image ? (
              <img
                src={game.header_image}
                alt={`Cover art for ${game.name}`}
                loading='eager'
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                }}
              />
            ) : <></>} */}
            {game.header_image && (
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
      <ScrollToTopButton />

    </div>
  );
};

export default GamesShowcase;