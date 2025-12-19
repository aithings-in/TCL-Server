import multer from "multer";
import multerS3 from "multer-s3";
import { s3, s3Config } from "../config/s3";
import { randomUUID } from "crypto";
import path from "path";

// Configure multer for S3
export const uploadToS3 = multer({
  storage: multerS3({
    s3: s3 as any, // Type assertion: multer-s3 v3 expects S3Client (AWS SDK v3) but we're using AWS SDK v2's S3
    bucket: s3Config.getBucket(),
    acl: "public-read",
    key: function (req: any, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${randomUUID()}${ext}`;
      const folder = req.body?.folder || "uploads";
      cb(null, `${folder}/${filename}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    // Allow images and documents
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only images and documents are allowed.")
      );
    }
  },
});

// Service class for S3 operations
export class S3Service {
  private config: typeof s3Config;

  constructor() {
    this.config = s3Config;
  }

  /**
   * Upload a single file to S3
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = "uploads"
  ): Promise<string> {
    try {
      const ext = path.extname(file.originalname);
      const filename = `${randomUUID()}${ext}`;
      const key = `${folder}/${filename}`;

      const url = await this.config.uploadToS3(file.buffer, key, file.mimetype);
      return url;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  /**
   * Upload multiple files to S3
   * @param files Array of Express.Multer.File objects
   * @param folder Folder path in S3 bucket
   * @returns Array of S3 URLs
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = "uploads"
  ): Promise<string[]> {
    try {
      // Prepare files for upload
      const filesToUpload = files.map((file) => {
        const ext = path.extname(file.originalname);
        const filename = `${randomUUID()}${ext}`;
        const key = `${folder}/${filename}`;

        return {
          buffer: file.buffer,
          key: key,
          contentType: file.mimetype,
        };
      });

      // Upload all files and get URLs array
      const urls = await this.config.uploadMultipleFiles(filesToUpload);
      return urls;
    } catch (error) {
      console.error("Error uploading multiple files to S3:", error);
      throw new Error("Failed to upload multiple files to S3");
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      // Remove the full URL and get just the key
      const s3Key = key.includes("amazonaws.com/")
        ? key.split("amazonaws.com/")[1]
        : key;

      await this.config.deleteFromS3(s3Key);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  /**
   * Get file URL from S3 key
   */
  getFileUrl(key: string): string {
    return this.config.getS3Url(key);
  }
}

// Export singleton instance for convenience
export const s3Service = new S3Service();
