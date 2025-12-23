import { Router } from "express";
import { registrationController } from "../controllers/registration.controller";
import { joiValidator } from "../middleware/joiValidator.middleware";
import { RegistrationValidation } from "../validation/registration.validation";

const router = Router();

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Create a new player registration
 *     tags: [Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leagueType
 *               - name
 *               - age
 *               - mobile
 *               - email
 *               - district
 *               - state
 *               - role
 *             properties:
 *               leagueType:
 *                 type: string
 *                 enum: [t20-2026, t10-2026, trial]
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *               district:
 *                 type: string
 *               state:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Batsman, Bowler, All-rounder, Wicketkeeper]
 *               profileImage:
 *                 type: string
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
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

export default router;
