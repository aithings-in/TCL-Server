import { Router } from "express";
import { registrationController } from "../controllers/registration.controller";
import { joiValidator } from "../middleware/joiValidator.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { RegistrationValidation } from "../validation/registration.validation";

const router = Router();

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Create a new registration
 *     tags: [Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       201:
 *         description: Registration created successfully
 *       400:
 *         description: Validation error or email already exists
 */
router.post(
  "/",
  joiValidator.validateBody(RegistrationValidation.createSchema),
  registrationController.createRegistration
);

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: Get all registrations (Admin/Moderator only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: registeredAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Registrations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin", "moderator"),
  joiValidator.validateQuery(
    RegistrationValidation.getRegistrationsQuerySchema
  ),
  registrationController.getAllRegistrations
);

/**
 * @swagger
 * /api/registrations/{id}:
 *   get:
 *     summary: Get single registration by ID (Admin/Moderator only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration retrieved successfully
 *       404:
 *         description: Registration not found
 */
router.get(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin", "moderator"),
  registrationController.getRegistration
);

/**
 * @swagger
 * /api/registrations/{id}/status:
 *   patch:
 *     summary: Update registration status (Admin/Moderator only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Registration not found
 */
router.patch(
  "/:id/status",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin", "moderator"),
  joiValidator.validateBody(RegistrationValidation.updateStatusSchema),
  registrationController.updateRegistrationStatus
);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: Delete registration (Admin only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration deleted successfully
 *       404:
 *         description: Registration not found
 */
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  registrationController.deleteRegistration
);

export default router;
