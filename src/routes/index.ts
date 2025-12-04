import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import VehiculeRoutes from './VehiculeRoutes';
import AuthRoutes from './AuthRoutes';


/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();


// ** Add VehiculeRouter ** //

// Init vehicule router
const vehiculeRouter = Router();

vehiculeRouter.get(Paths.Vehicules.Get, VehiculeRoutes.getAll);
vehiculeRouter.get(Paths.Vehicules.GetOne, VehiculeRoutes.getOne);
vehiculeRouter.post(Paths.Vehicules.Add, VehiculeRoutes.add);
vehiculeRouter.put(Paths.Vehicules.Update, VehiculeRoutes.update);
vehiculeRouter.delete(Paths.Vehicules.Delete, VehiculeRoutes.delete);

// ** Add AuthRouter ** //

// Init auth router
const authRouter = Router();
authRouter.post(Paths.Auth.GenerateToken, ...AuthRoutes.generateToken);


// Add VehiculeRouter
apiRouter.use(Paths.Vehicules.Base, vehiculeRouter);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);


/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
