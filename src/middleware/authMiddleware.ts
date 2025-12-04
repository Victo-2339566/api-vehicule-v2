import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RouteError } from '@src/common/util/route-errors';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

// Étendre l'interface Request pour y ajouter l'utilisateur décodé
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Les routes d'authentification sont publiques
  if (req.originalUrl.startsWith('/api/auth')) {
    return next();
  }

  // Les routes GET sont publiques
  if (req.method === 'GET') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(
      new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        "Accès refusé. Jeton d'authentification manquant.",
      ),
    );
  }

  const jwtsecret = ENV.Jwtsecret;
  if (!jwtsecret) {
    return next(
      new RouteError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Erreur de configuration du serveur (JWT_SECRET manquant).",
      ),
    );
  }

  jwt.verify(token, jwtsecret, (err, decoded) => {
    if (err) {
      // Jeton invalide ou expiré
      return next(
        new RouteError(
          HttpStatusCodes.FORBIDDEN,
          "Jeton d'authentification invalide ou expiré.",
        ),
      );
    }
    // Le jeton est valide, on attache l'utilisateur à la requête
    req.user = decoded;
    next();
  });
};

export default authenticateToken;
