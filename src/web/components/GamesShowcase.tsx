import React from "react";
import { useGameInfo } from "../hooks/useGameInfo";
import type { ExtendedGameInfo } from "../../../api/types/gameInfo.types";
import type { ReviewsSchemaType } from "../../../api/db/models/Reviews";
import GameNav from "./GameNav";
import LoadingOverlay from "./LoadingOverlay";
import "../css/gamesShowcase.css";

interface GameShowcaseProps {
  appId: number | string;
  menuOpened: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const GamesShowcase: React.FC<GameShowcaseProps> = ({
  appId,
  menuOpened,
  onNext,
  onPrev,
}) => {
  const { data, loading, error } = useGameInfo(appId);

  const game: ExtendedGameInfo | undefined = data?.gameDetails.data;
  const reviews: ReviewsSchemaType[] = data?.reviews?.reviews ?? [];
  const price = game?.price_overview?.final_formatted ?? "N/A";

  const isLoadingOverlay = loading && !!game;

  if (error || !game) {
    return <div className="game-showcase">Failed to load game info.</div>;
  }

  return (
    <div
      className={`recommendations-wrapper ${
        menuOpened ? "sidebar-opened" : ""
      }`}
    >
      <GameNav title={game.name} onPrev={onPrev} onNext={onNext} />
      <div className="game-showcase">
        {isLoadingOverlay && <LoadingOverlay />}
        <div className="left">
          <h2>DESCRIPTION</h2>
          <p>{game.short_description}</p>
          <div
            dangerouslySetInnerHTML={{ __html: game.about_the_game ?? "" }}
          />
          <p>Released: {game.release_date?.date || "N/A"}</p>
          {game.metacritic?.score && (
            <p>Metacritic Score: {game.metacritic.score}</p>
          )}
        </div>
        <div className="right">
          <div className="image-container">
            {game.header_image && (
              <img src={game.header_image} alt={game.name} />
            )}
            <div className="price-tag">{price}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesShowcase;