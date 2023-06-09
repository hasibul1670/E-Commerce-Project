import createHttpError from "http-errors";

import jwt from "jsonwebtoken";

const createJWT = (payload: Object, secretKey: any, expiresIn: any) => {

  if (typeof payload !== "object" || !payload  || Object.keys(payload).length === 0)  {
    throw createHttpError("payload must be a non-empty object");
  }

  if (typeof secretKey !== "string" || secretKey === "") {
    throw createHttpError("Secret key must be a non-empty string");
  }
  try {
    var token = jwt.sign(payload, secretKey, { expiresIn });

    return token;
  } catch (error) {
    throw error;
  }
};

export const JsonWebToken = {
  createJWT,
};
