import { Router } from 'express';
import MenuItemController from '../controllers/menuItem.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const menuItemApi = Router();

// 🆕 Public route: Search menu items
menuItemApi.get('/search', MenuItemController.search);

// Public routes
menuItemApi.get('/get', MenuItemController.getAll);
menuItemApi.get('/get/:id', MenuItemController.getById);

// Protected routes for Admin only
menuItemApi.post('/create', jwtAuthentication, verifyAdmin, MenuItemController.create);
menuItemApi.put('/update/:id', jwtAuthentication, verifyAdmin, MenuItemController.update);
menuItemApi.delete('/delete/:id', jwtAuthentication, verifyAdmin, MenuItemController.delete);

export default menuItemApi;
