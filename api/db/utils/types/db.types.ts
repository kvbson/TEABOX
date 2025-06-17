import { GameInfoSchemaType } from "../../models/GameInfo.js";

type UpsertResult = {
    success: boolean;
    gameInfoStats: {
      created: number;
      updated: number;
      skipped: number;
    };
    allGamesListStats: {
      created: number;
      skipped: number;
    };
    errors: Array<{
      steamAppId: number;
      error: string;
    }>;
  };

type GameListUpdateObject = {
    $set: GameInfoSchemaType,
    $setOnInsert: {
        createdAt: Date,
    }
};

export type { UpsertResult, GameListUpdateObject };