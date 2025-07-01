import { Router } from 'express';
import InventoryBatchController from '../controllers/inventoryBatch.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const inventoryBatchApi = Router();

inventoryBatchApi.get('/search', InventoryBatchController.getByKeyword);

inventoryBatchApi.get('/month', InventoryBatchController.getByMonth);

inventoryBatchApi.get('/names', InventoryBatchController.getUniqueItemNames);

inventoryBatchApi.get('/get', InventoryBatchController.getAll);

inventoryBatchApi.get('/get/:id', InventoryBatchController.getById);

inventoryBatchApi.post(
  '/create',
  jwtAuthentication,
  verifyAdmin,
  InventoryBatchController.create
);

inventoryBatchApi.put(
  '/update/:id',
  jwtAuthentication,
  verifyAdmin,
  InventoryBatchController.update
);

inventoryBatchApi.delete(
  '/delete/:id',
  jwtAuthentication,
  verifyAdmin,
  InventoryBatchController.delete
);

export default inventoryBatchApi;
