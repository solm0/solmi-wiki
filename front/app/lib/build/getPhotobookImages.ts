import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { photobookFolders, photobookRootFolder } from '../photobook';
import { PhotobookEntry } from '../type';

dotenv.config({ quiet: true });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Missing Cloudinary env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

type CloudinaryResource = {
  public_id: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
};

type CloudinaryResponse = {
  resources: CloudinaryResource[];
  next_cursor?: string;
};

async function fetchSearchResources(expression: string) {
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  do {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression,
        max_results: 500,
        next_cursor: nextCursor,
        sort_by: [{ public_id: 'asc' }],
      }),
    });

    if (!res.ok) {
      throw new Error(`Cloudinary search failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json() as CloudinaryResponse;
    resources.push(...data.resources);
    nextCursor = data.next_cursor;
  } while (nextCursor);

  return resources;
}

async function fetchPrefixResources(prefix: string) {
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  do {
    const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`);
    url.searchParams.set('prefix', prefix);
    url.searchParams.set('max_results', '500');

    if (nextCursor) {
      url.searchParams.set('next_cursor', nextCursor);
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Cloudinary prefix request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json() as CloudinaryResponse;
    resources.push(...data.resources);
    nextCursor = data.next_cursor;
  } while (nextCursor);

  return resources;
}

async function fetchFolderImages(folder: string) {
  const fullFolder = `${photobookRootFolder}/${folder}`;
  const prefix = `${fullFolder}/`;

  let resources = await fetchSearchResources(`resource_type:image AND asset_folder="${fullFolder}"`);
  if (resources.length === 0) {
    resources = await fetchSearchResources(`resource_type:image AND folder="${fullFolder}"`);
  }
  if (resources.length === 0) {
    resources = await fetchPrefixResources(prefix);
  }

  return resources
    .sort((a, b) => a.public_id.localeCompare(b.public_id))
    .map((image) => ({
      publicId: image.public_id,
      format: image.format,
      width: image.width,
      height: image.height,
      createdAt: image.created_at,
    }));
}

async function main() {
  const entries: PhotobookEntry[] = [];
  let totalImages = 0;

  for (const [postId, folder] of Object.entries(photobookFolders)) {
    const images = await fetchFolderImages(folder);
    totalImages += images.length;
    entries.push({
      postId,
      folder,
      images,
    });
  }

  if (totalImages === 0) {
    throw new Error('No photobook images were found in Cloudinary. Check folder names and Cloudinary folder mode.');
  }

  const outputPath = path.join(process.cwd(), 'public/data/photobook_images.json');
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
}

main().catch((error) => {
  console.error('Failed to fetch photobook images:', error);
  process.exit(1);
});
