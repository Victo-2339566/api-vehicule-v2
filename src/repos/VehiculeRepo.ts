import Vehicule from '@src/models/Vehicule';

/******************************************************************************
 * Fonctions
 ******************************************************************************/

/**
 * Récupère tous les véhicules avec quelques filtres simples.
 * @param filters - filtres possibles : disponible, categorie, prixMax, marque.
 */
async function getAll(filters: any = {}) {
  const query: any = {};

  if (filters.disponible !== undefined) {
    // on accepte "true"/"false" en string depuis les query params
    query.disponible = filters.disponible === 'true';
  }

  if (filters.categorie) {
    query.categorie = filters.categorie;
  }

  if (filters.prixMax) {
    query.prixJour = { $lte: Number(filters.prixMax) };
  }

  if (filters.marque) {
    query.marque = filters.marque;
  }

  // Pas de pagination ici, on garde ça simple
  return Vehicule.find(query).sort({ dateCreation: -1 });
}

/**
 * Récupère un véhicule par son ID.
 */
async function getOne(id: string) {
  return Vehicule.findById(id);
}

/**
 * Crée un nouveau véhicule.
 */
async function add(vehiculeData: any) {
  const nouveauVehicule = new Vehicule(vehiculeData);
  return nouveauVehicule.save();
}

/**
 * Met à jour un véhicule existant.
 */
async function update(id: string, vehiculeData: any) {
  return Vehicule.findByIdAndUpdate(id, vehiculeData, {
    new: true,
    runValidators: true,
  });
}

/**
 * Supprime un véhicule.
 */
async function delete_(id: string) {
  return Vehicule.findByIdAndDelete(id);
}

/******************************************************************************
 * Export default
 ******************************************************************************/

export default {
  getAll,
  getOne,
  add,
  update,
  delete: delete_,
} as const;
