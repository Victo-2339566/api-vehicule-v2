import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RouteError } from '@src/common/util/route-errors';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

// Permet d'ajouter la propriété 'user' à l'objet Request d'Express 
declare global {
  namespace Express {
    interface Request {
      user?: unknown;
    }
  }
}

/**
 * Middleware qui vérifie le JWT sur toutes les routes sauf :
 * - Les routes /api/auth/* (login, etc.)
 * - Les requêtes GET (lecture publique)
 */
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  
  //  Laisse routes d'authentification
  if (req.originalUrl.startsWith('/api/auth')) {
    return next();
  }

  //  Laisse toutes les requêtes GET 
  if (req.method === 'GET') {
    return next();
  }

  //  Récupérer le token depuis  Authorization
 
  const token = req.headers.authorization?.split(' ')[1];

  // si existe pas
  if (!token) {
    return next(
      new RouteError(HttpStatusCodes.UNAUTHORIZED, "Accès refusé : jeton manquant.")
    );
  }

  // Vérifier que la clé secrète JWT est configuré
  if (!ENV.Jwtsecret) {
    return next(
      new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Configuration invalide : JWT_SECRET manquant.")
    );
  }

  // verifie si tocken valide
  jwt.verify(token, ENV.Jwtsecret, (err, decoded) => {
    if (err) {
      // Token invalide 
      return next(
        new RouteError(HttpStatusCodes.FORBIDDEN, "Jeton invalide ou expiré.")
      );
    }

    // Token valide on stocke les infos de l'utilisateur dans req.user
    req.user = decoded;
    next(); 
  });
};

export default authenticateToken;