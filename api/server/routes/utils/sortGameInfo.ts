import { GameInfoSchemaType } from "../../../db/models/GameInfo.js";

export function sortGameInfo(games: GameInfoSchemaType[], userTags: string[]) {

  const calculateRelevance = (gameTags: string[]) => {
    let score = 0;
    gameTags.forEach((tag) => {
      const userTagIndex = userTags.indexOf(tag);
      if (userTagIndex !== -1) {
        // decay function - funkcja która zwiększa/zmniejsza wagę tagów w zależności od ich pozycji w tablicy userTags
        score += Math.pow(1.2, userTagIndex);
        // alt
        // score += 1 / (userTagIndex + 1);
      }
    });
    return score;
  };

  games.forEach((game) => {
    (game as GameInfoSchemaType & { relevance: number }).relevance = calculateRelevance(game.genres?.map(el => el.description ?? '') ?? []);
  });
  return (games as (GameInfoSchemaType & { relevance: number })[]).sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0));
}

