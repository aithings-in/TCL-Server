import mongoose, { Schema, Model } from "mongoose";
import { ILead } from "../types";

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });

const Lead: Model<ILead> = mongoose.model<ILead>("Lead", leadSchema);

export default Lead;

