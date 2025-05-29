// routes/menuItemComment.routes.js
import { Router } from 'express';
import MenuItemCommentController from '../controllers/menuItemComment.controller.js';
import { jwtAuthentication } from '../middlewares/passport.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const menuItemCommentApi = Router();

// 🆓 Public: Lấy tất cả comment (nếu cần)
menuItemCommentApi.get('/', MenuItemCommentController.getAllMenuItemComments);

// 🆓 Public: Tìm kiếm comment theo từ khóa (rating, tên khách, tên món ăn)
menuItemCommentApi.get('/search', MenuItemCommentController.searchMenuItemComments);

// 🆓 Public: Lấy comment theo menu item ID
menuItemCommentApi.get('/item/:item_id', MenuItemCommentController.getMenuItemComments);

// 🔒 Protected: Tạo comment (người dùng đã đăng nhập)
menuItemCommentApi.post('/', jwtAuthentication, MenuItemCommentController.createMenuItemComment);

// 🔒 Protected: Cập nhật comment (người dùng đã đăng nhập)
menuItemCommentApi.put('/:comment_id', jwtAuthentication, MenuItemCommentController.updateMenuItemComment);

// 🔒 Protected: Xoá comment (chỉ admin hoặc chính chủ comment, tùy quyền)
menuItemCommentApi.delete('/:comment_id', jwtAuthentication, verifyAdmin, MenuItemCommentController.deleteMenuItemComment);

export default menuItemCommentApi;
