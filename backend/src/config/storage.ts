import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

export const uploadsDirectory = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
export const isCloudinaryEnabled = Boolean(cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret);

if (isCloudinaryEnabled) {
  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
  });
}

export const ensureUploadsDirectory = () => {
  if (!isCloudinaryEnabled) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
  }
};

const getSafeExtension = (originalName: string) => {
  const extension = path.extname(originalName).toLowerCase();
  return /^[.a-z0-9]+$/.test(extension) ? extension : '';
};

const saveLocally = async (file: Express.Multer.File) => {
  ensureUploadsDirectory();
  const filename = `${randomUUID()}${getSafeExtension(file.originalname)}`;
  const destination = path.join(uploadsDirectory, filename);
  await fs.promises.writeFile(destination, file.buffer);
  return `/uploads/${filename}`;
};

const saveToCloudinary = (file: Express.Multer.File) =>
  new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || 'electricity-misuse-tracker',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error('Cloudinary upload failed.'));
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });

export const saveEvidenceImage = async (file: Express.Multer.File) => {
  if (isCloudinaryEnabled) {
    return saveToCloudinary(file);
  }

  return saveLocally(file);
};