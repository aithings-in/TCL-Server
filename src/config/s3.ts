import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * S3 Configuration Class
 * Handles AWS S3 configuration and operations
 */
export class S3Config {
  private s3Instance: AWS.S3;
  private bucket: string;
  private region: string;

  constructor() {
    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || "us-east-1",
    });

    // Create S3 instance
    this.s3Instance = new AWS.S3();

    // S3 configuration
    this.bucket = process.env.S3_BUCKET_NAME || "";
    this.region = process.env.AWS_REGION || "us-east-1";
  }

  /**
   * Get S3 instance
   */
  public getS3Instance(): AWS.S3 {
    return this.s3Instance;
  }

  /**
   * Get bucket name
   */
  public getBucket(): string {
    return this.bucket;
  }

  /**
   * Get region
   */
  public getRegion(): string {
    return this.region;
  }

  /**
   * Generate S3 URL from key
   */
  public getS3Url(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  /**
   * Delete file from S3
   */
  public async deleteFromS3(key: string): Promise<void> {
    try {
      await this.s3Instance
        .deleteObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw error;
    }
  }

  /**
   * Upload file to S3
   */
  public async uploadToS3(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<string> {
    try {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: "public-read", // Make file publicly accessible
      };

      await this.s3Instance.putObject(params).promise();
      return this.getS3Url(key);
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw error;
    }
  }

  /**
   * Upload multiple files to S3
   * @param files Array of file objects with buffer, key, and contentType
   * @returns Array of S3 URLs
   */
  public async uploadMultipleFiles(
    files: Array<{
      buffer: Buffer;
      key: string;
      contentType: string;
    }>
  ): Promise<string[]> {
    try {
      // Upload all files in parallel for better performance
      const uploadPromises = files.map((file) =>
        this.uploadToS3(file.buffer, file.key, file.contentType)
      );

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error("Error uploading multiple files to S3:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const s3Config = new S3Config();

// Export for backward compatibility (if needed)
export const s3 = s3Config.getS3Instance();
