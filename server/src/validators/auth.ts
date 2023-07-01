//registration Validation

import { body } from "express-validator";

const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name Should be at least 3-30 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password Should Be At Least 6 Characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 6 })
    .withMessage("Adress Should Be At Least 6 Characters"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  //optional image
  body("image")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Phone is required"),
];

export const Validation = {
  validateUserRegistration,
};
