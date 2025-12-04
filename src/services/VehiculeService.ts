import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import VehiculeRepo from '@src/repos/VehiculeRepo';
import { IVehicule } from '@src/models/Vehicule';

/******************************************************************************
 * Constantes
 ******************************************************************************/

export const VEHICULE_NON_TROUVE = 'Véhicule non trouvé';

/******************************************************************************
 * Fonctions
 ******************************************************************************/

/**
 * Récupère tous les véhicules (avec éventuels filtres).
 */
function getAll(filters: any = {}) {

  return VehiculeRepo.getAll(filters);
}

/**
 * Récupère un véhicule par son ID.
 */
async function getOne(id: string): Promise<IVehicule> {
  const vehicule = await VehiculeRepo.getOne(id);
  if (!vehicule) {
   
    throw new RouteError(HttpStatusCodes.NOT_FOUND, VEHICULE_NON_TROUVE);
  }
  return vehicule as IVehicule;
}

/**
 * Ajoute un véhicule.
 */
function addOne(vehicule: IVehicule) {
  return VehiculeRepo.add(vehicule);
}

/**
 * Met à jour un véhicule.
 */
async function updateOne(id: string, vehicule: IVehicule): Promise<IVehicule> {
  const persists = await VehiculeRepo.getOne(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, VEHICULE_NON_TROUVE);
  }

  const updated = await VehiculeRepo.update(id, vehicule);
  return updated as IVehicule;
}

/**
 * Supprime un véhicule par son id.
 */
async function _delete(id: string): Promise<void> {
  const persists = await VehiculeRepo.getOne(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, VEHICULE_NON_TROUVE);
  }

  await VehiculeRepo.delete(id);
}

/******************************************************************************
 * Export default
 ******************************************************************************/

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
} as const;
