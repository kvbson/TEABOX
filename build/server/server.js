import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connectDB, mongoose } from '../db/connections.js';
import gameInfo from './routes/GetGameInfo.js';
import tags from './routes/GetTags.js';
import userBadges from './routes/user/GetBadges.js';
import userOwnedGames from './routes/user/GetOwnedGames.js';
import userPlaytime from './routes/user/GetPlaytime.js';
import userProfileData from './routes/user/GetProfileData.js';
import userRecentGames from './routes/user/GetRecentGames.js';
import missingIds from './routes/db/GetMissingIds.js';
import topmostTags from './routes/utils/getTopmostTags.js';
import sortedGameInfo from './routes/db/GetSortedGameInfo.js';
const app = express();
const PREFIX = '/api/steam';
const PORT = process.env.PORT || 5000;
// CORS – uwzględnij tutaj produkcyjną domenę, jak już ją znasz
app.use(cors({
    origin: ['https://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(helmet());
// Połączenie z bazą danych
connectDB();
// ROUTES
const routes = [
    userPlaytime, userRecentGames, userOwnedGames, userProfileData,
    userBadges, gameInfo, missingIds, tags, topmostTags, sortedGameInfo
];
for (const route of routes) {
    app.use(PREFIX, route);
}
// HEALTH CHECK
app.get('/health', (_, res) => {
    res.status(200).json({ status: 'OK', dbState: mongoose.connection.readyState });
});
// START SERVER
async function startServer() {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
    const shutdown = () => {
        console.log('🛑 Shutting down server...');
        mongoose.connection.close(false);
        console.log('ℹ️ MongoDB connection closed');
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}
startServer().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
