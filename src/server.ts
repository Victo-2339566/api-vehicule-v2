import '../config';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import logger from 'jet-logger';

import Paths from '@src/common/constants/Paths';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { NodeEnvs } from '@src/common/constants';
import { RouteError } from '@src/common/util/route-errors';
import BaseRouter from '@src/routes';
import authenticateToken from '@src/middleware/authMiddleware';


const app = express();

/******************************************************************************
 * Middleware globaux 
 ******************************************************************************/


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger toutes les requêtes dans la console (pour déboguer) - Porposition IA Claude.ai pour mieux deboguer 
app.use((req, _res, next) => {
  logger.info(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});


if (ENV.NodeEnv === NodeEnvs.Dev) {
 
  app.use(morgan('dev'));
}

if (ENV.NodeEnv === NodeEnvs.Production && !process.env.DISABLE_HELMET) {
  // En production : sécuriser les headers HTTP avec helmet
  app.use(helmet());
}


  // Routes de documentation
// Redirection de la racine vers la documentation
app.get('/', (_req, res) => {
  res.redirect('/api-docs');
});

//  documentation Swagger
app.get('/api-docs', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});


 // Vérifie le token pour toutes les routes sauf /api/auth et les GET
app.use(authenticateToken);


app.use(Paths.Base, BaseRouter);

/******************************************************************************
 * Gestionnaire d'erreurs global 
 ******************************************************************************/

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Logger l'erreur sauf en mode test
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }

  // Déterminer le code de statut et le message
  let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';

  if (err instanceof RouteError) {
    status = err.status;
    message = err.message;
  }

  // Retourner l'erreur au client
  return res.status(status).json({ error: message });
});

export default app;