import express, { Router, Response, Request } from 'express';
import { validateRequest } from '../validators';
import handleValidationErrors from '../middleware/handleValidationErrors';
import askQuestion from '../controllers/askQuestion';

const playlistRouter = Router();

playlistRouter.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ message: 'OK' });
});

playlistRouter.get('/ask', askQuestion);

export default playlistRouter;
