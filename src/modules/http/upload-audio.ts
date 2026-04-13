import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import multer, { MulterError } from "multer";
import { NextFunction, Request, Response } from "express";
import { AppError } from "./app-error";

const audioUploadDirectory = path.resolve(process.cwd(), "uploads", "audio");

fs.mkdirSync(audioUploadDirectory, { recursive: true });

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
};

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, audioUploadDirectory);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, extension);
    const safeBaseName = sanitizeFileName(baseName) || "audio";
    const storedFileName = `${safeBaseName}-${randomUUID()}${extension}`;

    callback(null, storedFileName);
  }
});

const allowedAudioMimeTypes = new Set<string>([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/x-pn-wav",
  "audio/ogg",
  "audio/webm",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
  "audio/flac"
]);

const allowedAudioExtensions = new Set<string>([
  ".mp3",
  ".wav",
  ".ogg",
  ".webm",
  ".m4a",
  ".aac",
  ".flac"
]);

const uploadAudioMiddleware = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowedMimeType = allowedAudioMimeTypes.has(file.mimetype);
    const isAllowedExtension = allowedAudioExtensions.has(extension);

    if (!isAllowedMimeType && !isAllowedExtension) {
      callback(new AppError(400, "INVALID_AUDIO_FILE", "Only audio files are allowed"));
      return;
    }

    callback(null, true);
  }
});

const uploadSingleAudio = (request: Request, response: Response, next: NextFunction): void => {
  uploadAudioMiddleware.single("file")(request, response, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
      next(new AppError(400, "FILE_TOO_LARGE", "Audio file exceeds the 25 MB limit"));
      return;
    }

    next(error);
  });
};

export { audioUploadDirectory, uploadAudioMiddleware, uploadSingleAudio };
