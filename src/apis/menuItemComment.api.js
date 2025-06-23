// routes/menuItemComment.routes.js
import { Router } from 'express';
import MenuItemCommentController from '../controllers/menuItemComment.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const menuItemCommentApi = Router();

// Lấy tất cả comment 
menuItemCommentApi.get('/', MenuItemCommentController.getAllMenuItemComments);

// Tìm kiếm comment theo từ khóa (rating, tên khách, tên món ăn)
menuItemCommentApi.get('/search', MenuItemCommentController.searchMenuItemComments);

//  Lấy comment theo menu item ID
menuItemCommentApi.get('/item/:item_id', MenuItemCommentController.getMenuItemComments);

//  Tạo comment (người dùng đã đăng nhập)
menuItemCommentApi.post('/', jwtAuthentication, MenuItemCommentController.createMenuItemComment);

//Cập nhật comment (người dùng đã đăng nhập)
menuItemCommentApi.put('/:comment_id', jwtAuthentication, MenuItemCommentController.updateMenuItemComment);

// Xoá comment (chỉ admin hoặc chính chủ comment, tùy quyền)
menuItemCommentApi.delete('/:comment_id', jwtAuthentication, verifyAdmin, MenuItemCommentController.deleteMenuItemComment);

export default menuItemCommentApi;
