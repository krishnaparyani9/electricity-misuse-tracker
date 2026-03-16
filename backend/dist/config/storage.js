"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEvidenceImage = exports.ensureUploadsDirectory = exports.isCloudinaryEnabled = exports.uploadsDirectory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const cloudinary_1 = require("cloudinary");
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
exports.uploadsDirectory = path_1.default.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
exports.isCloudinaryEnabled = Boolean(cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret);
if (exports.isCloudinaryEnabled) {
    cloudinary_1.v2.config({
        cloud_name: cloudinaryCloudName,
        api_key: cloudinaryApiKey,
        api_secret: cloudinaryApiSecret,
    });
}
const ensureUploadsDirectory = () => {
    if (!exports.isCloudinaryEnabled) {
        fs_1.default.mkdirSync(exports.uploadsDirectory, { recursive: true });
    }
};
exports.ensureUploadsDirectory = ensureUploadsDirectory;
const getSafeExtension = (originalName) => {
    const extension = path_1.default.extname(originalName).toLowerCase();
    return /^[.a-z0-9]+$/.test(extension) ? extension : '';
};
const saveLocally = async (file) => {
    (0, exports.ensureUploadsDirectory)();
    const filename = `${(0, crypto_1.randomUUID)()}${getSafeExtension(file.originalname)}`;
    const destination = path_1.default.join(exports.uploadsDirectory, filename);
    await fs_1.default.promises.writeFile(destination, file.buffer);
    return `/uploads/${filename}`;
};
const saveToCloudinary = (file) => new Promise((resolve, reject) => {
    const uploadStream = cloudinary_1.v2.uploader.upload_stream({
        folder: process.env.CLOUDINARY_FOLDER || 'electricity-misuse-tracker',
        resource_type: 'auto',
    }, (error, result) => {
        if (error || !result?.secure_url) {
            reject(error || new Error('Cloudinary upload failed.'));
            return;
        }
        resolve(result.secure_url);
    });
    uploadStream.end(file.buffer);
});
const saveEvidenceImage = async (file) => {
    if (exports.isCloudinaryEnabled) {
        return saveToCloudinary(file);
    }
    return saveLocally(file);
};
exports.saveEvidenceImage = saveEvidenceImage;
