import { Secret } from "jsonwebtoken";

/** VARS */
export const ENTRYPOINT = "/v0";
export const APP_PORT = process.env.PORT || 5000;
export const APP_DB_URL =
  process.env.DB_URL || "mongodb://localhost:27017/core";
export const UNPROTECTED_ROUTES = [
  `${ENTRYPOINT}/login`,
  `${ENTRYPOINT}/user`,
];
export const EMAIL_REGEX = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

/** FUNCTIONS */
export const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing env for JWT secret");
  }

  return secret as Secret;
};

export const getAllowedOrigins = () => {
  let origins: string[] = [];

  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (envOrigins) {
    origins = envOrigins.split(", ");
  }

  return origins;
};
