import { Router } from 'express';
import {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  bookTable,
} from '../controllers/table.controller.js';

import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const tableApi = Router();
const adminOnly = [jwtAuthentication, verifyAdmin];

// Table APIs
tableApi.post('/', adminOnly, createTable);                
tableApi.get('/', getAllTables);               
tableApi.get('/:tableId', adminOnly, getTableById);       
tableApi.put('/:tableId', adminOnly, updateTable);     
tableApi.delete('/:tableId', adminOnly, deleteTable);        

tableApi.post('/book', jwtAuthentication, bookTable);     //socket

export default tableApi;
