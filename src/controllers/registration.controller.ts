import { Request, Response } from "express";
import Registration from "../models/Registration.model";
import Payment from "../models/Payment.model";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";
import { RAZORPAY_KEY_ID } from "./payment.controller";

/**
 * Registration Controller Class
 * Handles registration operations
 */
export class RegistrationController {
  /**
   * Create a new registration
   * @route   POST /api/registrations
   * @access  Public
   */
  public createRegistration = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { leagueType, name, age, mobile, email, district, state, role } =
        req.body;

      // Check if email already exists for the same league type
      const existingRegistration = await Registration.findOne({
        email,
        leagueType,
      });
      if (existingRegistration) {
        // Check payment status for this registration
        const payment = await Payment.findOne({
          registrationId: existingRegistration._id,
        });

        if (payment?.status === "completed") {
          res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: Messages.REGISTRATION.EMAIL_ALREADY_REGISTERED,
          } as ApiResponse);
          return;
        } else if (payment?.status === "pending") {
          res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            message: Messages.REGISTRATION.PAYMENT_PENDING,
            data: {
              ...existingRegistration.toObject(),
              payment: {
                paymentId: payment._id.toString(),
                orderId: payment.razorpayOrderId,
                amount: payment.amount / 100,
                currency: payment.currency,
                keyId: RAZORPAY_KEY_ID,
                status: payment.status,
              },
            },
          } as ApiResponse);
          return;
        } else {
          res.status(Constants.HTTP_STATUS.OK).json({
            success: true,
            message: Messages.REGISTRATION.REGISTRATIONS_RETRIEVED_SUCCESS,
            data: existingRegistration,
          } as ApiResponse);
          return;
        }
      }
      const registration = await Registration.create({
        leagueType,
        name,
        age: parseInt(age, 10),
        mobile,
        email,
        district,
        state,
        role,
        profileImage: req.body.profileImage || null,
        documents: req.body.documents || [],
      });

      res.status(Constants.HTTP_STATUS.CREATED).json({
        success: true,
        message: Messages.REGISTRATION.REGISTRATION_SUCCESS,
        data: registration,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.REGISTRATION.REGISTRATION_FAILED,
        error: error.message,
      } as ApiResponse);
    }
  };
}

// Export singleton instance
export const registrationController = new RegistrationController();
