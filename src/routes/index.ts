// src/routes/index.ts
import { Router } from 'express';
import VehiculeRoutes from './VehiculeRoutes';
import AuthRoutes from './AuthRoutes';
import Paths from '@src/common/constants/Paths';

const apiRouter = Router();

/******************************************************************************
 * Vehicules
 ******************************************************************************/

const vehiculeRouter = Router();

vehiculeRouter.get(Paths.Vehicules.Get,     VehiculeRoutes.getAll);
vehiculeRouter.get(Paths.Vehicules.GetOne,  VehiculeRoutes.getOne);
vehiculeRouter.post(Paths.Vehicules.Add,    VehiculeRoutes.add);
vehiculeRouter.put(Paths.Vehicules.Update,  VehiculeRoutes.update);
vehiculeRouter.delete(Paths.Vehicules.Delete, VehiculeRoutes.delete);

apiRouter.use(Paths.Vehicules.Base, vehiculeRouter);

/******************************************************************************
 * Auth
 ******************************************************************************/

const authRouter = Router();

// POST /api/auth/generatetoken
// Utilise le spread operator pour décomposer le tableau de middlewares
authRouter.post(Paths.Auth.GenerateToken, ...AuthRoutes.generateToken);

apiRouter.use(Paths.Auth.Base, authRouter);

export default apiRouter;