const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.post('/:post_id', likeController.addLike);
router.delete('/:like_id', likeController.deleteLike);
// router.get('/', likeController.);
router.get('/:post_id', likeController.getLikeByPostId);
router.get('/', likeController.getAllLikes);

module.exports = router;