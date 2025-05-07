import { body } from "express-validator";

export const validateRequest = [
  body("question")
    .isString()
    .isLength({ min: 1 })
    .withMessage("question is required"),
  body("sessionId")
    .isString()
    .isLength({ min: 1 })
    .withMessage("session is required"),
];
