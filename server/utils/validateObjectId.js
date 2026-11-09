
import mongoose from "mongoose";

const validateObjectId = (id) => {
  return mongoose.isValidObjectId(id);
};

export default validateObjectId;
