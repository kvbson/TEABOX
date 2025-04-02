import { Tag } from '#api/db/models/Tags';
import puppeteer from 'puppeteer';

export async function scrapeTags() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
  await page.goto('https://partner.steamgames.com/doc/store/tags#14', {
    waitUntil: 'networkidle2',
  });

  // Extract all tags
  const tags = (await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).map((el) =>
      el.textContent?.trim(),
    );
  })).filter(Boolean) as string[];

  if (!tags || tags.length === 0) {
    return console.warn('No tags found in scrapeTags');
  }

  await updateTagsInDB(tags);
  await browser.close();
  return tags;
}

const updateTagsInDB = async (tags: string[]) => {
  const bulkOps = tags.map((tag) => ({
    updateOne: {
      filter: { name: tag },
      update: { $set: { name: tag } },
      upsert: true,
    },
  }));

  if (bulkOps.length > 0) {
    await Tag.bulkWrite(bulkOps);
    console.log(`Updated ${bulkOps.length} tags`);
  }
};