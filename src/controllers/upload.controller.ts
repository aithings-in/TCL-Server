import { Request, Response } from "express";
import { s3Service } from "../services/s3.service";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

/**
 * Upload Controller Class
 * Handles file upload operations
 */
export class UploadController {
  /**
   * Upload single file
   * @route   POST /api/upload/single
   * @access  Private
   */
  public uploadSingle = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.UPLOAD.NO_FILE_PROVIDED,
        } as ApiResponse);
        return;
      }

      const folder = (req.body.folder as string) || "uploads";
      const fileUrl = await s3Service.uploadFile(req.file, folder);

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.UPLOAD.FILE_UPLOADED_SUCCESS,
        data: {
          url: fileUrl,
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.UPLOAD.FILE_UPLOAD_FAILED,
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Upload multiple files
   * @route   POST /api/upload/multiple
   * @access  Private
   */
  public uploadMultiple = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.UPLOAD.NO_FILES_PROVIDED,
        } as ApiResponse);
        return;
      }

      const folder = (req.body.folder as string) || "uploads";
      const files = Array.isArray(req.files) ? req.files : [req.files];

      // Normalize files to ensure we get proper array of File objects (multer can produce an object for fields)
      let normalizedFiles: Express.Multer.File[] = [];
      if (Array.isArray(files)) {
        // if req.files came as an array
        if (
          files.length > 0 &&
          typeof files[0] === "object" &&
          !files[0].originalname
        ) {
          // probably multer.fields output - object mapping fieldname to array of files
          for (const fileArr of files as any[]) {
            // fileArr is { [fieldname]: File[] }
            for (const arr of Object.values(fileArr)) {
              normalizedFiles.push(...(arr as Express.Multer.File[]));
            }
          }
        } else {
          normalizedFiles = files as Express.Multer.File[];
        }
      } else if (
        typeof files === "object" &&
        files !== null &&
        !Array.isArray(files)
      ) {
        // multer.fields style: an object mapping field names to arrays of files
        for (const arr of Object.values(files)) {
          normalizedFiles.push(...(arr as Express.Multer.File[]));
        }
      }

      // Upload multiple files and get array of URLs
      const urls = await s3Service.uploadMultipleFiles(normalizedFiles, folder);

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.UPLOAD.FILES_UPLOADED_SUCCESS,
        data: {
          urls, // Array of URLs
          count: urls.length,
        },
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.UPLOAD.FILE_UPLOAD_FAILED,
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Delete file
   * @route   DELETE /api/upload/:key
   * @access  Private
   */
  public deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { key } = req.params;

      if (!key) {
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.UPLOAD.FILE_KEY_REQUIRED,
        } as ApiResponse);
        return;
      }

      await s3Service.deleteFile(key);

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.UPLOAD.FILE_DELETED_SUCCESS,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.UPLOAD.FILE_DELETION_FAILED,
        error: error.message,
      } as ApiResponse);
    }
  };
}

// Export singleton instance
export const uploadController = new UploadController();

// Export for backward compatibility
export const uploadSingle = uploadController.uploadSingle;
export const uploadMultiple = uploadController.uploadMultiple;
export const deleteFile = uploadController.deleteFile;
