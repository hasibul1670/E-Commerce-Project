import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.SERVER_PORT,
  database_url: process.env.DATABASE_URL,
  default_user_pass: process.env.DEFAULT_USER_PASS,
  clientURL: process.env.CLIENT_URL || "",
  smtpUserName: process.env.SMTP_USER_NAME || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  uploadDir: process.env.UPLOAD_FILE || "public/images/users",
  maxFileSize: process.env.MAX_FILE_SIZE,
  mongoDbUrl:
    process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceDB2023",
  jwtActivationKey:
    process.env.JWT_ACTIVATION_KEY || "jdgsjdgshd65416546jhsgbds",
  jwtAccessKey:
    process.env.JWT_ACCESS_KEY || "VERY_ACCESS_KEY",
};

export const serverPort: number = parseInt(
  process.env.SERVER_PORT || "4000" || "https://ecom2023-rouge.vercel.app/"
);

//export const defaultImagePath = process.env.Default_User_Image_Path || "../public/images/users/default.jpg";
