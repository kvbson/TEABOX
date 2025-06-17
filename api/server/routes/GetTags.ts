
import { Router } from 'express';
import { Tag } from '../../db/models/Tags.js';
import { scrapeTags } from '../../utils/scrapeTags.js';

export const getTags = async () => {
  const tags = await Tag.find({}, { _id: 0, name: 1 });
  if (tags.length === 0) {
    return await scrapeTags() || [];
  }
  return tags;
};

const tags = Router();

tags.get('/tags', async (_, res) => {
  try {
    const data = await getTags();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default tags;