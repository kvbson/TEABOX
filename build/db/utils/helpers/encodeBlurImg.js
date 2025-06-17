import sharp from 'sharp';
import { encode } from 'blurhash';
import { GameInfo } from '#api/db/models/GameInfo';
import axios from 'axios';
const getImageData = async (imageUrl) => {
    const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data, 'binary');
    const { data, info } = await sharp(buffer)
        .resize(32, 32, { fit: 'inside' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    return {
        data,
        width: info.width,
        height: info.height,
    };
};
const generateBlurhash = async (imageUrl) => {
    try {
        const { data, width, height } = await getImageData(imageUrl);
        return encode(new Uint8ClampedArray(data), width, height, 4, 4);
    }
    catch (err) {
        console.error(`Failed to process ${imageUrl}:`, err?.message ?? '');
        return null;
    }
};
export const updateGamesWithBlurhash = async () => {
    const games = (await GameInfo.find({ blur_image: { $exists: false } }));
    try {
        for (const game of games) {
            if (!game.capsule_image && !game.header_image)
                continue;
            const blurhash = await generateBlurhash((game.capsule_image || game.header_image));
            console.log('blurhash: ', blurhash);
            if (blurhash) {
                await GameInfo.updateOne({ steam_appid: game.steam_appid }, { $set: { blur_image: blurhash } });
                console.log(`[Blurhash] Updated ${game.name}`);
            }
        }
    }
    catch (err) {
        console.log('[Blurhash] Error: ', err ?? 'Unkwnown error');
    }
};
