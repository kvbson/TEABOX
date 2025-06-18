import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import "../css/gamesShowcase.css";
import GameNav from "./GameNav";
import LoadingOverlay from "./LoadingOverlay";
import ScrollToTopButton from "./ui/ScrollToTopArror";
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
  const price =
    game?.price_overview?.final_formatted ?? (game?.is_free ? "FREE" : "N/A");

  console.log("game? ", game);

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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
    __html: DOMPurify.sanitize(html || ""),
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      onPrev();
    } else if (deltaX < -50) {
      onNext();
    }

    setTouchStartX(null);
  };

  return (
    <div
      className={`recommendations-wrapper ${
        sidebarOpened ? "sidebar-opened" : ""
      }`}
    >
      <GameNav
        className={`game-nav ${sidebarOpened ? "sidebar-opened" : ""}`}
        title={game?.name || "Loading..."}
        onPrev={onPrev}
        onNext={onNext}
      />

      {/* Karuzela z gestami */}
      <div
        className="game-showcase"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {(isLoading || isImageLoading) && <LoadingOverlay />}

        <section className="game-showcase__description">
          <h2 className="section-title">Description</h2>
          {game?.short_description?.trim() !== game?.about_the_game?.trim() && (
            <p>{game?.short_description || "No description available"}</p>
          )}
          {game?.about_the_game && (
            <div
              className="html-content"
              dangerouslySetInnerHTML={sanitizeHTML(game.about_the_game)}
            />
          )}

          <div className="game-details">
            {game?.release_date?.date && (
              <p>
                <strong>Released:</strong>{" "}
                {new Date(
                  game?.release_date?.date?.toString()
                ).toLocaleDateString("de-DE")}
              </p>
            )}
            {game?.metacritic?.score && (
              <p>
                <strong>Metacritic Score:</strong> {game.metacritic.score}
              </p>
            )}
          </div>
        </section>

        <aside className="game-showcase__media">
          <div className="image-container">
            {game.header_image && (
              <img
                src={game.header_image}
                alt={`Cover art for ${game.name}`}
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                }}
              />
            )}
            <div className="price-tag" aria-label="Game price">
              {price}
            </div>
          </div>
          {game?.genres?.length > 0 && (
            <div className="genre-list">
              {game.genres.map((genre: { id: number; description: string }) => (
                <span key={genre.id} className="genre-item">
                  {genre.description}
                </span>
              ))}
            </div>
          )}
          <section className="trade-offs">
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
        </aside>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default GamesShowcase;
