import { Router } from "express";
import { emailController } from "../controllers/email.controller";

const router = Router();

/**
 * @swagger
 * /api/emails/payment-reminders:
 *   post:
 *     summary: Send payment reminders to all users with incomplete payments
 *     tags: [Emails]
 *     responses:
 *       200:
 *         description: Payment reminders sent successfully
 */
router.post(
  "/payment-reminders",
  emailController.sendPaymentReminders
);

/**
 * @swagger
 * /api/emails/payment-reminder/{registrationId}:
 *   post:
 *     summary: Send payment reminder to a specific registration
 *     tags: [Emails]
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment reminder sent successfully
 *       404:
 *         description: Registration not found
 */
router.post(
  "/payment-reminder/:registrationId",
  emailController.sendPaymentReminderToRegistration
);

export default router;

