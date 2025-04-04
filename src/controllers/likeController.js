const likeModel = require('../models/likeModel');
const postModel = require('../models/postModel');

class LikeController {
    // async addLike(req, res) {
    //     try {
    //         const { post_id } = req.params;
    //         const { user_id } = req.body;
    //         console.log(post_id, user_id);
    //         if (!post_id || !user_id) {
    //             return res.status(400).json({ message: 'Thiếu thông tin!' });
    //         }
    //         const post = await postModel.getPostId(post_id);
    //         if (!post) {
    //             return res.status(404).json({ message: 'Bài viết không tồn tại!' });
    //         }
    //         await likeModel.addLikeByPostID(user_id, post_id);
    //         res.status(200).json({ message: 'Like bài viết thành công!' });
    //     } catch (error) {
    //         console.error('Lỗi khi thêm like:', error); // Log lỗi chi tiết
    //         res.status(500).json({ message: 'Lỗi server!', error });
    //     }
    // }
    async addLike(req, res) {
        try {
            const { post_id } = req.params;
            const { user_id } = req.body;
            console.log(post_id, user_id);
    
            if (!post_id || !user_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
    
            const post = await postModel.getPostId(post_id);
            if (!post) {
                return res.status(404).json({ message: 'Bài viết không tồn tại!' });
            }
    
            // Thêm like và lấy về like_id
            const like_id = await likeModel.addLikeByPostID(user_id, post_id);
    
            res.status(200).json({ 
                message: 'Like bài viết thành công!', 
                like_id 
            });
    
        } catch (error) {
            console.error('Lỗi khi thêm like:', error);
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async deleteLike(req, res) {
        try {
            const { like_id } = req.params; // Lấy từ query string
            console.log(like_id);
            if (!like_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const like = await likeModel.getLikeByLikeId(like_id);
            if (!like) {
                return res.status(404).json({ message: 'Like không tồn tại!' });
            }
            await likeModel.deleteLikeByID(like_id);
            res.status(200).json({ message: 'Unlike bài viết thành công!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    async getLikeByPostId(req, res) {
        try {
            const { post_id } = req.params;
            if (!post_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const post = await postModel.getPostId(post_id);
            if (!post) {
                return res.status(404).json({ message: 'Bài viết không tồn tại!' });
            }
            const like = await likeModel.getLikeCountByPostId(post_id);
            console.log(like);
            res.status(200).json("like count : " + like);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async getAllLikes(req, res) {
        try {
            const likes = await likeModel.getAllLikes();
            res.status(200).json(likes);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
}

module.exports = new LikeController();
