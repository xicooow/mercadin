import { NextFunction, Request, Response } from "express";

import { getAllowedOrigins } from "../constants";

export default (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { headers, method } = req;
  const allowedOrigins = getAllowedOrigins();

  const accessControlRequestMethod =
    headers["access-control-request-method"];

  let origin = headers.origin;
  if (!origin || !allowedOrigins.includes(origin)) origin = "";

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    [
      "GET",
      "PUT",
      "HEAD",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ].join(", ")
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    [
      "Origin",
      "Accept",
      "Referer",
      "Location",
      "User-Agent",
      "Content-Type",
      "Authorization",
      "Content-Disposition",
      "Access-Control-Request-Method",
    ].join(", ")
  );

  if (method === "OPTIONS" && accessControlRequestMethod) {
    // 200 response for preflight requests
    return res.sendStatus(200);
  }

  return next();
};
