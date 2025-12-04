import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RouteError } from '@src/common/util/route-errors';
import { body } from 'express-validator';
import { validate } from '@src/routes/common/util';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

// Validation pour la route de génération de jeton
const authValidation = [
  body('email').isEmail().withMessage("L'email est invalide."),
  body('password').isString().notEmpty().withMessage("Le mot de passe est requis."),
];

/******************************************************************************
 * Fonctions
 ******************************************************************************/

/**
 * Génère un jeton JWT pour l'authentification.
 */
async function generateToken(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  // Simulation d'un utilisateur "admin" simple pour le projet
  if (email === 'admin@example.com' && password === 'admin') {
    const jwtSecret = ENV.Jwtsecret;
    if (!jwtSecret) {
      return next(
        new RouteError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          "Erreur de configuration du serveur (JWT_SECRET manquant).",
        ),
      );
    }

    const userPayload = { email, role: 'admin' };

    const token = jwt.sign(userPayload, jwtSecret, { expiresIn: '1h' });

    return res.status(HttpStatusCodes.OK).json({
      success: true,
      token,
      message:
        "Jeton généré avec succès. Utilisez-le dans l'en-tête 'Authorization: Bearer <token>' pour les routes protégées.",
    });
  } else {
    return next(
      new RouteError(
        HttpStatusCodes.UNAUTHORIZED,
        "Identifiants invalides. Utilisez 'admin@example.com' et 'admin'.",
      ),
    );
  }
}

/******************************************************************************
 * Export default
 ******************************************************************************/

export default {
  generateToken: [
    ...authValidation,
    validate,
    generateToken,
  ],
} as const;
