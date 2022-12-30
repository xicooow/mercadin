import { Request, Response } from "express";

import { buildErrorMessage } from "../helpers/util";

export default (_req: Request, res: Response) => {
  return res.status(404).json(buildErrorMessage("Not Found"));
};
