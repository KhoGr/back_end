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
tableApi.post('/', adminOnly, createTable);                    // POST    /api/table
tableApi.get('/', getAllTables);                    // GET     /api/table
tableApi.get('/:tableId', adminOnly, getTableById);           // GET     /api/table/:tableId
tableApi.put('/:tableId', adminOnly, updateTable);            // PUT     /api/table/:tableId
tableApi.delete('/:tableId', adminOnly, deleteTable);         // DELETE  /api/table/:tableId

// Realtime Booking via HTTP (socket event sẽ emit ở controller)
tableApi.post('/book', jwtAuthentication, bookTable);         // POST    /api/table/book

export default tableApi;
