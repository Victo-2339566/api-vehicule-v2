import jsonfile from 'jsonfile';

import ENV from '@src/common/constants/ENV';
import { NodeEnvs } from '@src/common/constants';

import { IVehicule } from '@src/models/Vehicule';

/******************************************************************************
 * Constants
 ******************************************************************************/

const DB_FILE_NAME = (
  ENV.NodeEnv === NodeEnvs.Test
    ? 'database.test.json'
    : 'database.json'
);

/******************************************************************************
 * Types
 ******************************************************************************/

interface IDb {

  vehicules: IVehicule[];
}

/******************************************************************************
 * Functions
 ******************************************************************************/

function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}

function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile(__dirname + '/' + DB_FILE_NAME, db);
}

function cleanDb(): Promise<void> {
  return jsonfile.writeFile(__dirname + '/' + DB_FILE_NAME, {
    users: [],
    vehicules: [],
  });
}

/******************************************************************************
 * Export default
 ******************************************************************************/

export default {
  openDb,
  saveDb,
  cleanDb,
} as const;
