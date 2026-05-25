import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export function initCloudinary() {
  if (!isCloudinaryConfigured()) {
    console.warn('Cloudinary not configured — set CLOUDINARY_* in server/.env for media uploads');
    return false;
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
  console.log('Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
  return true;
}

export function getCloudinaryErrorMessage(err) {
  if (!err) return 'Upload failed';
  if (typeof err === 'string') return err;
  return err.error?.message || err.message || 'Cloudinary upload failed';
}

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else if (!result?.secure_url) reject(new Error('Cloudinary returned no URL'));
      else resolve(result);
    });
    stream.on('error', reject);
    stream.end(buffer);
  });
}

export async function uploadImage(buffer, folder = 'learnhub/thumbnails') {
  if (!configured) initCloudinary();
  if (!configured) throw new Error('Cloudinary is not configured');

  const result = await uploadBuffer(buffer, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return result.secure_url;
}


export async function uploadVideo(buffer, folder = 'learnhub/videos') {
  if (!configured) initCloudinary();
  if (!configured) throw new Error('Cloudinary is not configured');

  const result = await uploadBuffer(buffer, {
    folder,
    resource_type: 'video',
    chunk_size: 6_000_000,
  });
  return result.secure_url;
}

export async function uploadPdf(buffer, originalName, folder = 'learnhub/resources') {
  if (!configured) initCloudinary();
  if (!configured) throw new Error('Cloudinary is not configured');

  const baseName = originalName.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  const result = await uploadBuffer(buffer, {
    folder,
    // resource_type: 'auto',
    // public_id: `${baseName}-${Date.now()}.pdf`,
    resource_type: 'raw',
    // format: 'pdf',
    public_id: `${baseName}-${Date.now()}`,
  });
  return {
    url: result.secure_url,
    name: originalName,
    size: result.bytes,
    mimeType: 'application/pdf',
  };
}
