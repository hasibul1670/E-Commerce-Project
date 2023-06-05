import dotenv from "dotenv";

dotenv.config();

export const serverPort: number = parseInt(
  process.env.SERVER_PORT || "4000" || "https://ecom2023-rouge.vercel.app/"
);

export const mongoDbUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceDB2023";
export const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "jdgsjdgshd65416546jhsgbds";

//export const defaultImagePath = process.env.Default_User_Image_Path || "../public/images/users/default.jpg";
