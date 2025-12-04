import { Request, Response, NextFunction } from 'express';
import VehiculeService from '@src/services/VehiculeService';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IVehicule } from '@src/models/Vehicule';

/**
 * GET /vehicules
 * Possibilité de filtres via query string :
 *  - disponible
 *  - prixMax
 *  - categorie
 *  - marque
 */
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = req.query;
    const vehicules = await VehiculeService.getAll(filters);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: vehicules,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /vehicules/:id
 */
export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicule = await VehiculeService.getOne(req.params.id);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: vehicule,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /vehicules
 */
export async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const nouveauVehicule = await VehiculeService.addOne(req.body as IVehicule);

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: 'Véhicule créé avec succès.',
      data: nouveauVehicule,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /vehicules/:id
 */
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const vehiculeMisAJour = await VehiculeService.updateOne(
      req.params.id,
      req.body as IVehicule,
    );

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Véhicule mis à jour avec succès.',
      data: vehiculeMisAJour,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /vehicules/:id
 */
export async function delete_(req: Request, res: Response, next: NextFunction) {
  try {
    await VehiculeService.delete(req.params.id);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Véhicule supprimé avec succès.',
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getAll,
  getOne,
  add,
  update,
  delete: delete_,
};
