import express from 'express';
import menuItemCommentController from '../controllers/menuItemComment.controller.js';

const router = express.Router();

// Tạo mới comment
router.post('/', menuItemCommentController.createMenuItemComment);

// Tìm kiếm comment (có thể theo rating, tên khách, tên món)
router.get('/search', menuItemCommentController.searchMenuItemComments);

// Lấy tất cả comment theo menu item ID
router.get('/item/:item_id', menuItemCommentController.getMenuItemComments);

// Cập nhật comment
router.put('/:comment_id', menuItemCommentController.updateMenuItemComment);

// Xoá comment
router.delete('/:comment_id', menuItemCommentController.deleteMenuItemComment);

export default router;
