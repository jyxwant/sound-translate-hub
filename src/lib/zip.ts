import { Zip, strToU8 } from 'fflate';

export async function zipBlobs(files: { name: string; blob: Blob }[], onProgress?: (p: number) => void): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    const total = files.length;
    let processed = 0;

    const zip = new Zip((err, dat, final) => {
      if (err) {
        reject(err);
        return;
      }
      if (dat) chunks.push(dat);
      if (final) {
        resolve(new Blob(chunks, { type: 'application/zip' }));
      }
    });

    files.forEach(async ({ name, blob }) => {
      const writer = zip.add(name, { level: 6 });
      const arr = new Uint8Array(await blob.arrayBuffer());
      writer.push(arr, true);
      processed += 1;
      if (onProgress) onProgress(processed / total);
    });

    zip.end();
  });
}

