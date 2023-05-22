import dotenv from 'dotenv';

dotenv.config();

export const serverPort: number = parseInt(process.env.SERVER_PORT || "4000");
