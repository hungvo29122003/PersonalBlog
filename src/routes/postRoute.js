const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/PostController');
// const { verifyToken } = require('../utils/auth');
// console.log(verifyToken); 
console.log(postController);
router.post('/', postController.createPost);

router.put('/:post_id', postController.updatePost);

router.delete('/:post_id', postController.deletePost);

router.get('/', postController.getAllPosts);
router.get('/count', postController.getAllPostsCount);

// Route hiển thị chi tiết bài viết
// router.get('/details/:post_id', postController.getPostDetails);
router.get('/details/:post_id', postController.getPostDetailsById);

// Routes cho API chi tiết bài viết
router.post('/details/:post_id', postController.addPostDetails);
router.put('/details/:details_post_id', postController.updatePostDetails);
router.delete('/details/:details_post_id', postController.deletePostDetails);

// router.get('/', async (req, res) => {
//     try {
//       const posts = await postController.getAllPosts(); // Lấy danh sách bài viết
//         res.render('posts', { posts }); // Trả về template Pug
//     } catch (error) {
//         console.error("Lỗi trong postController.getAllPosts():", error); // Log lỗi chi tiết
//        return res.status(500).json({ message: 'Lỗi tải bài viết', error });
//     }
//   });
module.exports = router;
