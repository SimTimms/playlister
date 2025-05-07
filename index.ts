// ===================================================
// IMPORTS
// ===================================================
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playlisterRouter from './app/routes/playlister';
import healthRouter from './app/routes/health';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

// ===================================================
// SETUP
// ===================================================
app.use(cors());
app.use(express.json());

// ===================================================
// ROUTES
// ===================================================

app.use('/api/playlister', playlisterRouter);
app.get('/health', healthRouter);

// ===================================================
// 404 - NOT FOUND
// ===================================================

app.use((_: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

// ===================================================
// ERROR HANDLER
// ===================================================

app.use((error: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: error.message });
});

// ===================================================
// SERVER
// ===================================================

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
