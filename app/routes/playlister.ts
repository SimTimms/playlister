import { Router, Response, Request } from 'express';

import askQuestion from '../controllers/askQuestion';

const playlistRouter = Router();

playlistRouter.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ message: 'OK' });
});

playlistRouter.get('/ask/:playlistid', askQuestion);

export default playlistRouter;
