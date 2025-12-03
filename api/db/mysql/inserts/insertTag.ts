import { getMySqlPool } from '../connections.js';
import { normalizeValue } from '../utils/functions.js';

export type TagSchemaType = {
    name: string
}

export async function insertTag(tag: TagSchemaType) {
  if (!tag?.name) {
    console.warn('Skipping invalid user info:', tag);
    return;
  }

  const pool = await getMySqlPool();
  await pool.query(
    'REPLACE INTO tags SET ?',
    [{
      tag_name: normalizeValue(tag.name),
    }],
  );
}
