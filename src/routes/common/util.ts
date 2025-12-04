import { NextFunction, Request, Response } from 'express';
import {
  validationResult,
  ValidationChain,
  Result,
  ValidationError,
} from 'express-validator';
// fichier regenerer par chatgpt pour corriger un bug de typescript
type AnyValidationError = ValidationError & {
  param?: string;
  msg?: unknown;
  [key: string]: unknown;
};

/**
 * Formatte les erreurs de validation express-validator
 */
export function formatValidationErrors(
  errors: Result<ValidationError>,
): Record<string, string>[] {
  const extractedErrors: Record<string, string>[] = [];

  const list = errors.array() as AnyValidationError[];

  list.forEach((err) => {
    const param = err.param ?? '_error';
    const msg = String(err.msg ?? 'Validation error');
    extractedErrors.push({ [param]: msg });
  });

  return extractedErrors;
}

/**
 * Middleware générique pour exécuter un tableau de validations
 * et retourner une réponse 400 structurée en cas d'erreur.
 */
export const validate =
  (validations: ValidationChain[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formatted = formatValidationErrors(errors);

    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: formatted,
    });
  };
