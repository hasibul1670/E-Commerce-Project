import dotenv from "dotenv";

dotenv.config();

export const serverPort: number = parseInt(process.env.SERVER_PORT || "4000");
export const mongoDbUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceDB2023";
