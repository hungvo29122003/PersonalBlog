const commentModel = require('../models/commentModel');

class CommentController {
    // Lấy tất cả bình luận
    async getAllComments(req, res) {
        try {
            const comments = await commentModel.getAllComments();
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    // Thêm bình luận mới
    async addComment(req, res) {
        try {
            const { post_id, user_id, content, parent_id } = req.body;
    
            if (!post_id || !user_id || !content.trim()) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
    
            // Kiểm tra nếu có parent_id thì phải tồn tại
            if (parent_id) {
                const parentComment = await commentModel.getCommentById(parent_id);
                if (!parentComment) {
                    return res.status(400).json({ message: 'Bình luận cha không tồn tại!' });
                }
            }
    
            const comment_id = await commentModel.addComment(post_id, user_id, content.trim(), parent_id);
            res.status(201).json({ message: 'Thêm bình luận thành công!', comment_id });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    // Cập nhật bình luận
    async updateComment(req, res) {
        try {
            const { comment_id } = req.params;
            const { user_id, content } = req.body;
            if (!comment_id  || !content) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }

            await commentModel.updateComment(comment_id, content);
            res.status(200).json({ message: 'Cập nhật bình luận thành công!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    // Xóa bình luận
    async deleteComment(req, res) {
        try {
            const { comment_id } = req.params;
            const { user_id } = req.body;
            if (!comment_id || !user_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }

            await commentModel.deleteComment(comment_id, user_id);
            res.status(200).json({ message: 'Xóa bình luận thành công!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async getCommentByPostId(req, res) {
        try {
            const { post_id } = req.params;
            if (!post_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }

            const comments = await commentModel.getCommentByPostId(post_id);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async getCommentByPostId1(req, res) {
        try {
            const { post_id } = req.params;
            if (!post_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const comments = await commentModel.getCommentByPostId1(post_id);
             return res.status(200).json(comments);
        } catch (error) {
             returnres.status(500).json({ message: 'Lỗi server!', error });
        }
    }
}

module.exports = new CommentController();
