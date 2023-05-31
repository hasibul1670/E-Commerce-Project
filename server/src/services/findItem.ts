import createHttpError from "http-errors";
import mongoose from "mongoose";

export const findWithId= async (Model: mongoose.Model<any> ,id: string,options={}):Promise<any> => {
  try {

    const item = await Model.findById(id,options);

    if (!item) {
      throw createHttpError(404, `${Model.modelName} doesn't exist with this Id`);
    }
    
    return item;
  } catch (error) {
    if (error instanceof mongoose.MongooseError) {
      throw createHttpError(400, "Invalid User ID");
    }
    throw error;
  }
};
