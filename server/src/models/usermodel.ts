var bcrypt = require("bcryptjs");
import { Document, Schema, model } from "mongoose";

interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  address: string;
  image: Buffer;
  phone: string;
  isBanned: boolean;
  isAdmin: boolean;
}

const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      maxlength: [31, "User Name not allowed more than 31 characters"],
      minlength: [3, "User Name not allowed less than 3 characters"],
    },
    email: {
      required: [true, "Email is required"],
      trim: true,
      type: String,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v: string): boolean {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      trim: true,
      minlength: [6, "Password not allowed less than 6 characters"],
      set: (v: string) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: Buffer,
      contentType: String,
      required: [true,'User Image is required']
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [6, "Address must be 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = model<IUserDocument>("Users", userSchema);
