const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../utils/auth');

router.post('/', commentController.addComment);
router.put('/:comment_id', commentController.updateComment);
router.delete('/:comment_id', commentController.deleteComment);
router.get('/', commentController.getAllComments);
router.get('/:post_id', commentController.getCommentByPostId);
router.get('/post/:post_id', commentController.getCommentByPostId1);
module.exports = router;
