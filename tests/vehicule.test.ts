import { expect, describe, it, beforeAll } from 'vitest';
import { agent } from './support/setup';
import Vehicule from '../src/models/Vehicule';
import Paths from '../common/constants/Paths';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';

// Données de base pour un véhicule valide
const vehiculeValide = {
  marque: 'Toyota',
  modele: 'Corolla',
  immatriculation: 'ABC-123',
  categorie: 'Standard',
  prixJour: 50,
  annee: 2020,
  disponible: true,
  transmission: 'Automatique',
  options: ['GPS', 'Bluetooth'],
};

describe('API Vehicules', () => {
  let token: string;
  let vehiculeId: string;

  beforeAll(async () => {
    // Obtenir un jeton JWT valide
    const response = await agent
      .post(Paths.Base + Paths.Auth.Base + Paths.Auth.GenerateToken)
      .send({ email: 'admin@example.com', password: 'admin' });

    token = response.body.token;
  });

  // POST /vehicules - Création valide
  it('devrait créer un nouveau véhicule avec des données valides', async () => {
    const response = await agent
      .post(Paths.Base + Paths.Vehicules.Base + Paths.Vehicules.Add)
      .set('Authorization', `Bearer ${token}`)
      .send(vehiculeValide);

    expect(response.statusCode).toBe(HttpStatusCodes.CREATED);
    expect(response.body.success).toBe(true);
    expect(response.body.data.marque).toBe(vehiculeValide.marque);
    expect(response.body.data.immatriculation).toBe(vehiculeValide.immatriculation);
    vehiculeId = response.body.data._id;
  });

  // POST /vehicules - Création invalide (prix hors limites)
  it("ne devrait pas créer de véhicule si le prix est hors limites", async () => {
    const vehiculeInvalide = {
      ...vehiculeValide,
      immatriculation: 'INVALIDE-1',
      prixJour: 10, // Min = 20
    };

    const response = await agent
      .post(Paths.Base + Paths.Vehicules.Base + Paths.Vehicules.Add)
      .set('Authorization', `Bearer ${token}`)
      .send(vehiculeInvalide);

    expect(response.statusCode).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(typeof response.body.error).toBe('string');
    // Optionnel : vérifie le message Mongoose exact
    expect(response.body.error).toContain('Le prix par jour doit être');
  });

  // POST /vehicules - Création invalide (catégorie Luxe avec prix trop bas)
  it("ne devrait pas créer de véhicule Luxe si le prix est inférieur à 80", async () => {
    const vehiculeInvalide = {
      ...vehiculeValide,
      immatriculation: 'INVALIDE-2',
      categorie: 'Luxe',
      prixJour: 79,
    };

    const response = await agent
      .post(Paths.Base + Paths.Vehicules.Base + Paths.Vehicules.Add)
      .set('Authorization', `Bearer ${token}`)
      .send(vehiculeInvalide);

    expect(response.statusCode).toBe(HttpStatusCodes.BAD_REQUEST);
    expect(typeof response.body.error).toBe('string');
    expect(response.body.error).toContain(
      'Pour un véhicule de catégorie Luxe, le prix par jour doit être d\'au moins 80 $.',
    );
  });

  // GET /vehicules - Sans filtre
  it('devrait retourner la liste des véhicules', async () => {
  // S’assurer qu’il y a au moins un véhicule
  await Vehicule.create({ ...vehiculeValide, immatriculation: 'GET-1' });

  const response = await agent.get(
    Paths.Base + Paths.Vehicules.Base + Paths.Vehicules.Get,
  );

  expect(response.statusCode).toBe(HttpStatusCodes.OK);
  expect(response.body.success).toBe(true);
  expect(Array.isArray(response.body.data)).toBe(true);
  expect(response.body.data.length).toBeGreaterThan(0);
});

  // GET /vehicules - Avec filtre disponible=true
  it('devrait filtrer les véhicules disponibles', async () => {
  await Vehicule.create({
    ...vehiculeValide,
    immatriculation: 'DISPO-1',
    disponible: true,
  });
  await Vehicule.create({
    ...vehiculeValide,
    immatriculation: 'NON-DISPO-1',
    disponible: false,
  });

  const response = await agent.get(
    Paths.Base +
      Paths.Vehicules.Base +
      Paths.Vehicules.Get +
      '?disponible=true',
  );

  expect(response.statusCode).toBe(HttpStatusCodes.OK);
  expect(response.body.success).toBe(true);
  expect(Array.isArray(response.body.data)).toBe(true);
  response.body.data.forEach((v: any) => {
    expect(v.disponible).toBe(true);
  });
});


  // PUT /vehicules/:id - Mise à jour valide
  it('devrait mettre à jour un véhicule existant', async () => {
    const vehicule = await Vehicule.create({
      ...vehiculeValide,
      immatriculation: 'PUT-1',
    });
    const nouvelleMarque = 'Honda';

    const response = await agent
      .put(Paths.Base + Paths.Vehicules.Base + '/' + vehicule._id)
      .set('Authorization', `Bearer ${token}`)
      .send({ marque: nouvelleMarque });

    expect(response.statusCode).toBe(HttpStatusCodes.OK);
    expect(response.body.success).toBe(true);
    expect(response.body.data.marque).toBe(nouvelleMarque);
  });

  // DELETE /vehicules/:id - Suppression
  it('devrait supprimer un véhicule existant', async () => {
    const vehicule = await Vehicule.create({
      ...vehiculeValide,
      immatriculation: 'DELETE-1',
    });

    const response = await agent
      .delete(Paths.Base + Paths.Vehicules.Base + '/' + vehicule._id)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(HttpStatusCodes.OK);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Véhicule supprimé avec succès.');

    const vehiculeSupprime = await Vehicule.findById(vehicule._id);
    expect(vehiculeSupprime).toBeNull();
  });
});
