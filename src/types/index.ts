import { Request } from "express";
import { Document } from "mongoose";

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
  name: string;
  age: number;
  mobile: string;
  email: string;
  district: string;
  state: string;
  role: string;
  profileImage?: string;
  documents?: string[];
  registeredAt: Date;
  status: "pending" | "approved" | "rejected";
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
