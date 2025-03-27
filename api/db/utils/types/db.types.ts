import { GameInfo } from '@api/db/models/GameInfo.js';
import { InferSchemaType } from 'mongoose';

export type DBResult = {
    totalProcessed: number,
    created: number,
    updated: number,
    skipped: number,
    errors: unknown[],
};

export type GameListUpdateObject = {
    $set: InferSchemaType<typeof GameInfo>,
    $setOnInsert: {
        createdAt: Date,
    }
}