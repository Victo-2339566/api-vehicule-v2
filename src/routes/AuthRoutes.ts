import { Request, Response, NextFunction, RequestHandler } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';
import { validate } from '@src/routes/common/util';
import User from '@src/models/User';

// --- Validation ---
const validateLogin = [
  body('email').isEmail().withMessage("L'email est invalide."),
  body('password').isString().notEmpty().withMessage('Le mot de passe est requis.'),
];

// --- Handler ---
const generateTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // 1. Chercher l'utilisateur en BD
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).exec();

    if (!user || user.password !== password) {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, 'Identifiants invalides');
    }

    // 2. Générer le JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      ENV.Jwtsecret,
      { expiresIn: '1h' }
    );

    return res.status(HttpStatusCodes.OK).json({
      success: true,
      token,
    });
  } catch (err) {
    return next(err);
  }
};

// --- Export ---
const AuthRoutes = {
  generateToken: [
    ...validateLogin,
    validate(validateLogin),  
    generateTokenHandler,
  ] as RequestHandler[],
};

export default AuthRoutes;