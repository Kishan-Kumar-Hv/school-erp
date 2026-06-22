import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary if environment variables are set
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a file (either Buffer or base64) to Cloudinary or falls back to local storage
 * @param {File | Buffer} file - The file object from Request formData or a raw Buffer
 * @param {string} fileName - Original file name or target identifier
 * @param {string} folder - Folder classification (e.g. 'gallery', 'faculty', 'documents')
 * @returns {Promise<string>} - The public URL of the uploaded asset
 */
export async function uploadAsset(file, fileName, folder = 'school-cms') {
  // If no file was provided, return empty
  if (!file) return '';

  const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '_')}`;

  // Helper to convert Web File/Blob to ArrayBuffer and then Buffer
  let buffer;
  if (typeof file.arrayBuffer === 'function') {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else if (Buffer.isBuffer(file)) {
    buffer = file;
  } else {
    throw new Error('Unsupported file format for upload');
  }

  // 1. Cloudinary upload path
  if (isCloudinaryConfigured) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: path.parse(uniqueFileName).name,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    } catch (error) {
      console.error('Cloudinary upload failed, falling back to local storage:', error);
    }
  }

  // 2. Local fallback storage path
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);
    
    // Return relative URL serving statically from public/
    return `/uploads/${folder}/${uniqueFileName}`;
  } catch (error) {
    console.error('Local file write failed:', error);
    throw new Error('File upload failed: ' + error.message);
  }
}
