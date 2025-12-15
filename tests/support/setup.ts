import { MongoMemoryServer, } from 'mongodb-memory-server';
import { beforeAll, beforeEach,afterAll} from 'vitest';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../src/server';

let mongo: MongoMemoryServer;

// Créer une instance de supertest pour les tests
export const agent = supertest(app);

// Avant tous les tests
beforeAll(async () => {
  // Démarrer le serveur MongoDB en mémoire
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // Se connecter à la base de données en mémoire
  await mongoose.connect(mongoUri);
});

// Avant chaque test
beforeEach(async () => {
  // Nettoyer la base de données avant chaque test
  const collections = await mongoose.connection.db!.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// Après tous les tests
afterAll(async () => {
  // Arrêter la connexion Mongoose et le serveur en mémoire
  await mongoose.connection.close();
  await mongo.stop();
});
