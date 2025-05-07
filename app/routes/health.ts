// ===================================================
// IMPORTS
// ===================================================

import express, { Router, Response, Request } from "express";
const healthRouter: Router = express.Router();

// ===================================================
// ROUTES
// ===================================================

healthRouter.get("/health", (_: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

export default healthRouter;
