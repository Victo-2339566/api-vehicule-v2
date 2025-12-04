/* eslint-disable n/no-process-env */
import path from "path";
import dotenv from "dotenv";

// Chemin vers le fichier .env de tests
const pathToEnv = path.join(__dirname, "./.env.test");
console.log(`Using test environment file: ${pathToEnv}`);

const result = dotenv.config({ path: pathToEnv });
if (result.error) {
  throw result.error;
}
