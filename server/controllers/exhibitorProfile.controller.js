
import ExhibitorProfile from "../models/exhibitorProfile.model.js";

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await ExhibitorProfile.findOne({
      exhibitor: req.user._id,
    }).populate("exhibitor", "username email");

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const {
      companyName,
      logoUrl,
      description,
      contactPerson,
      phone,
      website,
      address,
      productsServices,
    } = req.body;

    if (
      typeof companyName !== "string" ||
      !companyName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    if (
      productsServices !== undefined &&
      !Array.isArray(productsServices)
    ) {
      return res.status(400).json({
        success: false,
        message: "Products and services must be an array",
      });
    }

    const profile = await ExhibitorProfile.findOneAndUpdate(
      {
        exhibitor: req.user._id,
      },
      {
        $set: {
          companyName: companyName.trim(),
          logoUrl: logoUrl || "",
          description: description || "",
          contactPerson: contactPerson || "",
          phone: phone || "",
          website: website || "",
          address: address || "",
          productsServices: productsServices || [],
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).populate("exhibitor", "username email");

    return res.status(200).json({
      success: true,
      message: "Company profile saved successfully",
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const exhibitorProfileController = {
  getMyProfile,
  updateMyProfile,
};

export default exhibitorProfileController;
