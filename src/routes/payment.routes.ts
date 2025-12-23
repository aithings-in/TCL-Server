import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { joiValidator } from "../middleware/joiValidator.middleware";
import { PaymentValidation } from "../validation/payment.validation";

const router = Router();

/**
 * @swagger
 * /api/payments/initialize:
 *   post:
 *     summary: Initialize payment with Razorpay
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationId
 *             properties:
 *               registrationId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment initialized successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Registration not found
 */
router.post(
  "/initialize",
  joiValidator.validateBody(PaymentValidation.initializeSchema),
  paymentController.initializePayment
);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify Razorpay payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *               - paymentId
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *               paymentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid signature
 *       404:
 *         description: Payment not found
 */
router.post(
  "/verify",
  joiValidator.validateBody(PaymentValidation.verifySchema),
  paymentController.verifyPayment
);

/**
 * @swagger
 * /api/payments/{paymentId}:
 *   get:
 *     summary: Get payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *       404:
 *         description: Payment not found
 */
router.get("/:paymentId", paymentController.getPaymentStatus);

export default router;

