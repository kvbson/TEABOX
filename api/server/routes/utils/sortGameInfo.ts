import { GameInfoSchemaType } from '#api/db/models/GameInfo';

export function sortGameInfo(games: GameInfoSchemaType[], userTags: string[]) {
  // Calculate relevance for each game
  const calculateRelevance = (gameTags: string[]) => {
    let score = 0;
    gameTags.forEach((tag) => {
      const userTagIndex = userTags.indexOf(tag);
      if (userTagIndex !== -1) {
      // Weight = 1 / (position + 1) to prioritize earlier tags
        score += 1 / (userTagIndex + 1);
      }
    });
    return score;
  };

  // Add relevance to each game
  games.forEach((game) => {
    (game as GameInfoSchemaType & { relevance: number }).relevance = calculateRelevance(game.genres?.map(el => el.description ?? '') ?? []);
  });
  console.log(games);
  console.log((games as (GameInfoSchemaType & { relevance: number })[]).sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0)));
  // Sort by relevance (descending)
  return (games as (GameInfoSchemaType & { relevance: number })[]).sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0));
}

