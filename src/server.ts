import '../config'; // Remonte à la racine pour trouver config.ts
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

// Utilisation des alias @src pour éviter les erreurs de chemin
import BaseRouter from '@src/routes'; 
import authenticateToken from '@src/middleware/authMiddleware';

import Paths from '@src/common/constants/Paths';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';
import { NodeEnvs } from '@src/common/constants';

const app = express();

/******************************************************************************
 * Middleware
 ******************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

// Auth JWT (protège tout sauf /api/auth et les routes GET publiques si nécessaire)
app.use(authenticateToken);

// Routes API
app.use(Paths.Base, BaseRouter);

/******************************************************************************
 * Error handler
 ******************************************************************************/

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }

  let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';

  if (err instanceof RouteError) {
    status = err.status;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    status = HttpStatusCodes.BAD_REQUEST;
    const firstError = Object.values((err as any).errors)[0] as any;
    message = firstError.message;
  }

  return res.status(status).json({
    error: message,
  });
});

/******************************************************************************
 * Documentation Swagger & Front
 ******************************************************************************/

// Documentation ou redirection racine
app.get('/api-docs/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Assure-toi que ce fichier existe si tu l'utilises
});

app.get('/', (req: Request, res: Response) => {
  res.redirect('/api-docs');
});

export default app;