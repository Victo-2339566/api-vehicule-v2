import './config';
import logger from 'jet-logger';
import server from './src/server';
import mongoose from 'mongoose';
import { CONFIG } from './config';

/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MSG = `Express server started on port: ${CONFIG.port}`;

/******************************************************************************
                                  Run
******************************************************************************/

const connectDB = async () => {
  try {
    const mongoUri = CONFIG.mongodbUri;
    if (!mongoUri) {
      throw new Error("MONGODB n'est pas défini dans les variables d'environnement.");
    }

    await mongoose.connect(mongoUri);
    logger.info('Connexion à MongoDB réussie.');
  } catch (error) {
    logger.err('Erreur de connexion à MongoDB: ' + String((error as Error).message ?? error));
    process.exit(1);
  }
};

connectDB().then(() => {
  server.listen(Number(CONFIG.port) || 3000, (err?: Error) => {
    if (err) {
      logger.err(err.message);
    } else {
      logger.info(SERVER_START_MSG);
    }
  });
});
