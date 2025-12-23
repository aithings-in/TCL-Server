import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Registration from "../models/Registration.model";
import Payment from "../models/Payment.model";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";

// Razorpay configuration - read from environment at runtime
export const getRazorpayKeyId = (): string => {
  return process.env.RAZORPAY_KEY_ID || "";
};

export const getRazorpayKeySecret = (): string => {
  return process.env.RAZORPAY_KEY_SECRET || "";
};

// For backward compatibility
export const RAZORPAY_KEY_ID = getRazorpayKeyId();
export const RAZORPAY_KEY_SECRET = getRazorpayKeySecret();

// Initialize Razorpay instance lazily
let razorpayInstance: Razorpay | null = null;

const getRazorpayInstance = (): Razorpay => {
  if (!razorpayInstance) {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error(
        "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables."
      );
    }
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// League pricing configuration
const LEAGUE_PRICING: Record<string, number> = {
  "t20-2026": 5000, // Example: ₹5000 for T20 league
  "t10-2026": 3000, // Example: ₹3000 for T10 league
  trial: 1000, // Example: ₹1000 for trial
};

/**
 * Payment Controller Class
 * Handles payment operations with Razorpay
 */
export class PaymentController {
  /**
   * Initialize payment (create Razorpay order)
   * @route   POST /api/payments/initialize
   * @access  Public
   */
  public initializePayment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { registrationId } = req.body;

      // Find registration
      const registration = await Registration.findById(registrationId);
      if (!registration) {
        res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Registration not found",
        } as ApiResponse);
        return;
      }

      // Check if payment already exists for this registration
      const existingPayment = await Payment.findOne({
        registrationId,
      });

      if (existingPayment) {
        if (existingPayment.status === "completed") {
          res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Payment already completed for this registration",
          } as ApiResponse);
          return;
        } else if (existingPayment.status === "pending") {
          // Return existing pending payment details
          res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            message: "Payment already initialized",
            data: {
              paymentId: existingPayment._id.toString(),
              orderId: existingPayment.razorpayOrderId,
              amount: existingPayment.amount / 100, // Convert back to rupees
              currency: existingPayment.currency,
              keyId: RAZORPAY_KEY_ID,
            },
          } as ApiResponse);
          return;
        }
      }

      // Get amount based on league type
      const amount = LEAGUE_PRICING[registration.leagueType] || 1000;

      // Create Razorpay order using SDK
      // Receipt must be max 40 characters
      const receiptId = `${registrationId.toString().slice(-12)}_${Date.now().toString().slice(-8)}`;
      const receipt = receiptId.length > 40 ? receiptId.slice(-40) : receiptId;

      const orderData = {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: receipt,
        notes: {
          registrationId: registrationId.toString(),
          leagueType: registration.leagueType,
          email: registration.email,
        },
      };

      // Create order using Razorpay SDK
      const razorpay = getRazorpayInstance();
      const razorpayOrder = await razorpay.orders.create(orderData);

      // Save payment record
      const payment = await Payment.create({
        registrationId,
        amount,
        currency: "INR",
        razorpayOrderId: razorpayOrder.id.toString(),
        status: "pending",
      });

      res.status(Constants.HTTP_STATUS.CREATED).json({
        success: true,
        message: "Payment initialized successfully",
        data: {
          paymentId: payment._id.toString(),
          orderId: razorpayOrder.id.toString(),
          amount: Number(razorpayOrder.amount) / 100, // Convert back to rupees
          currency: razorpayOrder.currency,
          keyId: RAZORPAY_KEY_ID,
        },
      } as ApiResponse);
    } catch (error: any) {
      console.error(error);
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to initialize payment",
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Verify and complete payment
   * @route   POST /api/payments/verify
   * @access  Public
   */
  public verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentId,
      } = req.body;

      // Find payment record
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Payment record not found",
        } as ApiResponse);
        return;
      }

      // Verify signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Invalid payment signature",
        } as ApiResponse);
        return;
      }

      // Update payment record
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = "completed";
      await payment.save();

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: "Payment verified and completed successfully",
        data: payment,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to verify payment",
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Get payment status
   * @route   GET /api/payments/:paymentId
   * @access  Public
   */
  public getPaymentStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const payment = await Payment.findById(req.params.paymentId).populate(
        "registrationId"
      );

      if (!payment) {
        res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Payment not found",
        } as ApiResponse);
        return;
      }

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: "Payment status retrieved successfully",
        data: payment,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to retrieve payment status",
        error: error.message,
      } as ApiResponse);
    }
  };
}

// Export singleton instance
export const paymentController = new PaymentController();
