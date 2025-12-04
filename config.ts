/* eslint-disable n/no-process-env */
import path from 'path';
import dotenv from 'dotenv';
import moduleAlias from 'module-alias';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

// 1. En LOCAL : charger config/.env.development, .env.test, etc.
if (NODE_ENV !== 'production') {
  const envPath = path.join(process.cwd(), `config/.env.${NODE_ENV}`);
  dotenv.config({ path: envPath });
  console.log(`Loaded local env file: ${envPath}`);
}

// 2. En PROD : alias @src → dist/src
// __dirname = /dist pour config.js
if (__filename.endsWith('.js')) {
  moduleAlias.addAlias('@src', path.join(__dirname, 'src'));
}

// 3. Export centralisé
export const CONFIG = {
  nodeEnv: NODE_ENV,
  port: process.env.PORT ?? '3000',
  mongodbUri: process.env.MONGODB ?? '',
  jwtSecret: process.env.JWTSECRET ?? '',
};
