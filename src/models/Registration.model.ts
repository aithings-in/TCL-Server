import mongoose, { Schema, Model } from "mongoose";
import { IRegistration } from "../types";

const registrationSchema = new Schema<IRegistration>(
  {
    leagueType: {
      type: String,
      default: "trial",
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [10, "Age must be at least 10"],
      max: [30, "Age must be at most 30"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit mobile number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"],
    },
    profileImage: {
      type: String,
      default: null,
    },
    documents: {
      type: [String],
      default: [],
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
registrationSchema.index({ email: 1 });
registrationSchema.index({ leagueType: 1 });
registrationSchema.index({ registeredAt: -1 });

const Registration: Model<IRegistration> = mongoose.model<IRegistration>(
  "Registration",
  registrationSchema
);

export default Registration;
