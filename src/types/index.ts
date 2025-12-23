import { Request } from "express";
import { Document, Types } from "mongoose";

// Extended Request interface with user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Registration types
export interface IRegistration extends Document {
  leagueType: string;
  name: string;
  age: number;
  mobile: string;
  email: string;
  district: string;
  state: string;
  role: "Batsman" | "Bowler" | "All-rounder" | "Wicketkeeper";
  profileImage?: string;
  documents?: string[];
  registeredAt: Date;
}

// Payment types
export interface IPayment extends Document {
  registrationId: Types.ObjectId;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

// Lead types
export interface ILead extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

// User types
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
