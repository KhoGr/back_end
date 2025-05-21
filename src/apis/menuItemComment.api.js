// routes/menuItemComment.route.js
import express from 'express';
import menuItemCommentController from '../controllers/menuItemComment.controller.js';

const router = express.Router();

// Tạo mới comment
router.post('/', menuItemCommentController.createComment);

// Lấy tất cả comment theo menu item ID
router.get('/item/:item_id', menuItemCommentController.getCommentsByItemId);

// Cập nhật comment
router.put('/:comment_id', menuItemCommentController.updateComment);

// Xoá comment
router.delete('/:comment_id', menuItemCommentController.deleteComment);

export default router;
