import { Request, Response } from "express";
import Lead from "../models/Lead.model";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";

/**
 * Lead Controller Class
 * Handles lead/contact form operations
 */
export class LeadController {
  /**
   * Create a new lead
   * @route   POST /api/leads
   * @access  Public
   */
  public createLead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, message } = req.body;

      const lead = await Lead.create({
        name,
        email,
        message,
      });

      res.status(Constants.HTTP_STATUS.CREATED).json({
        success: true,
        message: "Thank you for contacting us! We'll get back to you soon.",
        data: lead,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to submit your message. Please try again.",
        error: error.message,
      } as ApiResponse);
    }
  };
}

// Export singleton instance
export const leadController = new LeadController();

