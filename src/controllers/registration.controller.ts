import { Request, Response } from "express";
import Registration from "../models/Registration.model";
import { ApiResponse, PaginatedResponse, IRegistration } from "../types";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

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
      const { name, age, mobile, email, district, state, role } = req.body;

      // Check if email already exists
      const existingRegistration = await Registration.findOne({ email });
      if (existingRegistration) {
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.REGISTRATION.EMAIL_ALREADY_REGISTERED,
        } as ApiResponse);
        return;
      }

      const registration = await Registration.create({
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

  /**
   * Get all registrations
   * @route   GET /api/registrations
   * @access  Private (Admin/Moderator)
   */
  public getAllRegistrations = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "registeredAt",
        order = "desc",
        status,
      } = req.query;

      const query: any = {};
      if (status) {
        query.status = status;
      }

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const sortOrder = order === "asc" ? 1 : -1;
      const sortObj: any = {};
      sortObj[sort as string] = sortOrder;

      const registrations = await Registration.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum);

      const total = await Registration.countDocuments(query);

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.REGISTRATION.REGISTRATIONS_RETRIEVED_SUCCESS,
        data: registrations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      } as PaginatedResponse<IRegistration>);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.REGISTRATION.FAILED_TO_RETRIEVE_REGISTRATIONS,
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Get single registration
   * @route   GET /api/registrations/:id
   * @access  Private (Admin/Moderator)
   */
  public getRegistration = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const registration = await Registration.findById(req.params.id);

      if (!registration) {
        res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: Messages.REGISTRATION.REGISTRATION_NOT_FOUND,
        } as ApiResponse);
        return;
      }

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.REGISTRATION.REGISTRATION_RETRIEVED_SUCCESS,
        data: registration,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.REGISTRATION.FAILED_TO_RETRIEVE_REGISTRATION,
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Update registration status
   * @route   PATCH /api/registrations/:id/status
   * @access  Private (Admin/Moderator)
   */
  public updateRegistrationStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.REGISTRATION.INVALID_STATUS,
        } as ApiResponse);
        return;
      }

      const registration = await Registration.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!registration) {
        res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: Messages.REGISTRATION.REGISTRATION_NOT_FOUND,
        } as ApiResponse);
        return;
      }

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.REGISTRATION.STATUS_UPDATED_SUCCESS,
        data: registration,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.REGISTRATION.FAILED_TO_UPDATE_STATUS,
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Delete registration
   * @route   DELETE /api/registrations/:id
   * @access  Private (Admin)
   */
  public deleteRegistration = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const registration = await Registration.findByIdAndDelete(req.params.id);

      if (!registration) {
        res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: Messages.REGISTRATION.REGISTRATION_NOT_FOUND,
        } as ApiResponse);
        return;
      }

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.REGISTRATION.REGISTRATION_DELETED_SUCCESS,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.REGISTRATION.FAILED_TO_DELETE_REGISTRATION,
        error: error.message,
      } as ApiResponse);
    }
  };
}

// Export singleton instance
export const registrationController = new RegistrationController();

// Export for backward compatibility
export const createRegistration = registrationController.createRegistration;
export const getAllRegistrations = registrationController.getAllRegistrations;
export const getRegistration = registrationController.getRegistration;
export const updateRegistrationStatus =
  registrationController.updateRegistrationStatus;
export const deleteRegistration = registrationController.deleteRegistration;
