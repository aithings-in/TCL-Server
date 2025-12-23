import { Request, Response } from "express";
import Registration from "../models/Registration.model";
import Payment from "../models/Payment.model";
import { emailService } from "../services/email.service";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";

// League pricing configuration (should match payment controller)
const LEAGUE_PRICING: Record<string, number> = {
  "t20-2026": 5000,
  "t10-2026": 3000,
  trial: 1000,
};

/**
 * Email Controller Class
 * Handles email operations
 */
export class EmailController {
  /**
   * Send payment reminders to users with incomplete payments
   * @route   POST /api/emails/payment-reminders
   * @access  Public (should be protected in production)
   */
  public sendPaymentReminders = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Find all registrations that don't have a completed payment
      const allRegistrations = await Registration.find();
      const completedPaymentRegIds = await Payment.distinct("registrationId", {
        status: "completed",
      });

      const pendingRegistrations = allRegistrations.filter(
        (reg) =>
          !completedPaymentRegIds.some(
            (id) => id.toString() === reg._id.toString()
          )
      );

      if (pendingRegistrations.length === 0) {
        res.status(Constants.HTTP_STATUS.OK).json({
          success: true,
          message: "No pending payments found",
          data: { sent: 0, failed: 0 },
        } as ApiResponse);
        return;
      }

      let sent = 0;
      let failed = 0;

      // Send reminder emails
      for (const registration of pendingRegistrations) {
        try {
          const amount = LEAGUE_PRICING[registration.leagueType] || 1000;

          await emailService.sendPaymentReminder(
            registration.email,
            registration.name,
            registration.leagueType,
            amount,
            registration._id.toString()
          );
          sent++;
        } catch (error) {
          console.error(
            `Failed to send reminder to ${registration.email}:`,
            error
          );
          failed++;
        }
      }

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: `Payment reminders sent. ${sent} successful, ${failed} failed.`,
        data: { sent, failed, total: pendingRegistrations.length },
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to send payment reminders",
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Send payment reminder to a specific registration
   * @route   POST /api/emails/payment-reminder/:registrationId
   * @access  Public
   */
  public sendPaymentReminderToRegistration = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { registrationId } = req.params;

      const registration = await Registration.findById(registrationId);
      if (!registration) {
        res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Registration not found",
        } as ApiResponse);
        return;
      }

      // Check if payment already completed for this registration
      const existingPayment = await Payment.findOne({
        registrationId,
        status: "completed",
      });
      if (existingPayment) {
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Payment already completed for this registration",
        } as ApiResponse);
        return;
      }

      const amount = LEAGUE_PRICING[registration.leagueType] || 1000;

      await emailService.sendPaymentReminder(
        registration.email,
        registration.name,
        registration.leagueType,
        amount,
        registration._id.toString()
      );

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: "Payment reminder sent successfully",
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to send payment reminder",
        error: error.message,
      } as ApiResponse);
    }
  };
}

// Export singleton instance
export const emailController = new EmailController();
