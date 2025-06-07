import { GameInfo } from '#api/db/models/GameInfo';
import mongoose from 'mongoose';
import fs from 'node:fs';
import { Reviews } from '#api/db/models/Reviews';
import { Firestore, Timestamp } from '@google-cloud/firestore';

export const initializeFirestore = async () => {
  const mongoDbState = mongoose.connection.readyState;
  if (mongoDbState === 1) {
    console.log('✅ MongoDB is connected, Firestore initialized successfully.');
  } else {
    return console.error('❌ MongoDB is not connected, Firestore initialization failed.');
  }
  const serviceAccount = JSON.parse(fs.readFileSync('api/certs/firestore-acc.json', 'utf-8'));

  const firestore = new Firestore({
    projectId: serviceAccount.project_id,
    keyFilename: 'api/certs/firestore-acc.json',
    databaseId: 'teaboxdb',
  });

  try {
    await firestore.listCollections(); // This will throw if not connected
  } catch (err: unknown) {
    throw new Error(`Firestore connection failed: ${err instanceof Error ? err.message : err}`);
  }

  const gameInfos = firestore.collection('GameInfos');
  console.log((await gameInfos.count().get()).data().count);
  const reviews = firestore.collection('Reviews');
  console.log((await reviews.count().get()).data().count);

  const [allGames, allReviews] = await Promise.all([GameInfo.find().lean(), Reviews.find().lean()]);

  console.log('Cleaning process started...');
  const cleanedGames = allGames.map(el => cleanForFirestore(el));
  const cleanedReviews = allReviews.map(el => cleanForFirestore(el));
  console.log('Cleaning process finished.');

  const batchSize = 250;

  const saveGameInfosToFirestore = async () => {
    for (let i = 0; i < cleanedGames.length; i += batchSize) {
      console.log('Saving batch...');
      const batch = firestore.batch();
      const chunk = cleanedGames.slice(i, i + batchSize);

      chunk.forEach(record => {
        const docRef = gameInfos.doc();
        batch.set(docRef, record);
      });
      await batch.commit();
      console.log('Batch saved successfully.');
    }
  };

  const saveReviewsToFirestore = async () => {
    for (let i = 0; i < cleanedReviews.length; i += batchSize) {
      console.log('Saving batch...');
      const batch = firestore.batch();
      const chunk = cleanedReviews.slice(i, i + batchSize);

      chunk.forEach(record => {
        const docRef = reviews.doc();
        batch.set(docRef, record);
      });

      await batch.commit();
      console.log('Batch saved successfully.');
    }
  };

  try {
    await saveGameInfosToFirestore();
    await saveReviewsToFirestore();
  } catch (err: unknown) {
    console.log('Error during saving to Firestore: ', err instanceof Error ? err.message : err);
  }
};

function cleanForFirestore(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore);
  } else if (obj && typeof obj === 'object') {
    // Convert MongoDB ObjectId
    if (obj.constructor?.name === 'ObjectId') {
      return obj.toString();
    }

    // Convert MongoDB Date
    if (obj instanceof Date) {
      return Timestamp.fromDate(obj);
    }

    const cleaned: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id' || key === '__v') {
        continue; // Remove MongoDB metadata
      }
      cleaned[key] = cleanForFirestore(value);
    }

    return cleaned;
  }

  // Return primitive as-is
  return obj;
}

