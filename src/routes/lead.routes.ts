import { Router } from "express";
import { leadController } from "../controllers/lead.controller";
import { joiValidator } from "../middleware/joiValidator.middleware";
import { LeadValidation } from "../validation/lead.validation";

const router = Router();

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Submit a contact form lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead submitted successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  joiValidator.validateBody(LeadValidation.createSchema),
  leadController.createLead
);

export default router;

