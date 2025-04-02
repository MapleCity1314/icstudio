import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
      {
            content: {
                  type: String,
                  required: true,
            },
            createdAt: {
                  type: Date,
                  default: Date.now,
            },
      },
      {
            timestamps: true,
      }
);

export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);