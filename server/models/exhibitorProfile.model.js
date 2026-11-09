
import mongoose from "mongoose";

const exhibitorProfileSchema = new mongoose.Schema(
  {
    exhibitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    contactPerson: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    productsServices: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ExhibitorProfile = mongoose.model(
  "ExhibitorProfile",
  exhibitorProfileSchema
);

export default ExhibitorProfile;
