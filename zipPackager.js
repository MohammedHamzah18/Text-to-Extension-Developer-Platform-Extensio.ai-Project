import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import archiver from 'archiver';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_ROOT = path.resolve(process.env.UPLOAD_DIR || './storage');

export async function ensureStorageDirs() {
  await fs.mkdir(path.join(STORAGE_ROOT, 'temp'), { recursive: true });
  await fs.mkdir(path.join(STORAGE_ROOT, 'zips'), { recursive: true });
}

/**
 * Write files to temp dir, create ZIP, return public URL path.
 */
export async function packageExtensionZip(userId, extensionId, files) {
  await ensureStorageDirs();
  const jobId = uuidv4();
  const tempDir = path.join(STORAGE_ROOT, 'temp', jobId);
  await fs.mkdir(tempDir, { recursive: true });

  try {
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(tempDir, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      if (Buffer.isBuffer(content)) {
        await fs.writeFile(fullPath, content);
      } else {
        await fs.writeFile(fullPath, String(content), 'utf-8');
      }
    }

    const zipName = `${extensionId}-${Date.now()}.zip`;
    const zipPath = path.join(STORAGE_ROOT, 'zips', zipName);
    await createZipFromDirectory(tempDir, zipPath);

    const zipUrl = `/storage/zips/${zipName}`;
    return { zipUrl, zipPath, zipName };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

function createZipFromDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fsSync.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(outPath));
    archive.on('error', reject);
    output.on('error', reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
