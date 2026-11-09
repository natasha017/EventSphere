import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    exhibitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    booth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booth",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


applicationSchema.index(
  { event: 1, exhibitor: 1 },
  { unique: true }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;
