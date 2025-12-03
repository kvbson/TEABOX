export async function batch(
  items: any[],
  batchSize = 10,
  handler: (item: any) => Promise<void>,
  failOnError = false, // if true: stop after all batches, but throw collected errors
) {
  const total = items.length;
  let processed = 0;
  const errors: { index: number; error: unknown }[] = [];

  console.log(`Starting batch: ${total} items, size = ${batchSize}`);

  for (let i = 0; i < total; i += batchSize) {
    const chunkIndex = Math.floor(i / batchSize) + 1;
    const chunk = items.slice(i, i + batchSize);

    console.log(`Processing chunk ${chunkIndex} (${chunk.length} items)...`);

    await Promise.all(
      chunk.map(async (item, idx) => {
        const absoluteIndex = i + idx;

        try {
          await handler(item);
        } catch (err) {
          console.error(
            `Error in item index ${absoluteIndex}:`,
            err,
          );
          errors.push({ index: absoluteIndex, error: err });
        }

        processed++;
        const percent = ((processed / total) * 100).toFixed(1);
        console.log(`Progress: ${processed}/${total} (${percent}%)`);
      }),
    );
  }

  console.log('Batch completed.');

  if (failOnError && errors.length) {
    throw new Error(
      `Batch finished with ${errors.length} errors. First error: ${String(
        errors[0].error,
      )}`,
    );
  }

  if (errors.length) {
    console.warn(`Completed with ${errors.length} errors.`);
  }
}

/**Simpler ver */
export async function insertInBatches<T>(
  items: T[],
  batchSize: number,
  handler: (item: T) => Promise<any>,
) {
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    await Promise.all(chunk.map(handler));
  }
}
