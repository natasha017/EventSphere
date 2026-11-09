import mongoose from "mongoose";

const boothSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    boothNumber: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

boothSchema.index(
  { event: 1, boothNumber: 1 },
  { unique: true }
);

const Booth = mongoose.model("Booth", boothSchema);

export default Booth;
