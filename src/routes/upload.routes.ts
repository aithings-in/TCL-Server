import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { joiValidator } from "../middleware/joiValidator.middleware";
import { UploadValidation } from "../validation/upload.validation";

const router = Router();

// Configure multer for memory storage (for S3 upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// All upload routes require authentication
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/upload/single:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 default: uploads
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file provided
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/single",
  upload.single("file"),
  joiValidator.validateBody(UploadValidation.uploadBodySchema),
  uploadController.uploadSingle
);

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *                 default: uploads
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     urls:
 *                       type: array
 *                       items:
 *                         type: string
 *                     count:
 *                       type: number
 *       400:
 *         description: No files provided
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/multiple",
  upload.array("files", 10),
  joiValidator.validateBody(UploadValidation.uploadBodySchema),
  uploadController.uploadMultiple
);

/**
 * @swagger
 * /api/upload/{key}:
 *   delete:
 *     summary: Delete a file from S3
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: S3 file key or URL
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         description: File key is required
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:key",
  joiValidator.validateParams(UploadValidation.deleteFileParamsSchema),
  uploadController.deleteFile
);

export default router;
