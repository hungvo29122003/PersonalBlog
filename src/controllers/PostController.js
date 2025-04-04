const path = require('path');
const fs = require('fs');
const PostModel = require('../models/postModel');
console.log(PostModel);


class PostController {
    // Lấy tất cả bài viết
    async getAllPosts(req, res) {
        try {
            const posts = await PostModel.getAllPosts();
            if (posts.length === 0) {
                return res.status(404).json({ message: 'Không có bài viết nào!' });
            }
            res.status(200).json(posts);
            // res.render('posts', { posts }); // Trả về template Pug
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    // Tạo bài viết mới
    async createPost(req, res) {
        try {
            console.log('Create post request body:', req.body);
            console.log('Create post request files:', req.files);
            
            const { title, content, admin_id } = req.body;
            
            if (!admin_id || !title || !content) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }

            let imagePath = null;
            
            // Xử lý file ảnh nếu có
            if (req.files && req.files.image) {
                const imageFile = req.files.image;
                const uploadDir = path.join(__dirname, '../../public/uploads/posts');
                
                // Tạo thư mục uploads nếu chưa tồn tại
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                const timestamp = Date.now();
                const fileName = `${timestamp}-${imageFile.name}`;
                const savePath = path.join(uploadDir, fileName);
                
                // Lưu file
                await imageFile.mv(savePath);
                console.log(`File uploaded to: ${savePath}`);
                
                // Đường dẫn tương đối cho database
                imagePath = `/uploads/posts/${fileName}`;
            }
            
            // Tạo bài viết với hoặc không có ảnh
            let result;
            if (imagePath) {
                result = await PostModel.createPostWithImage(admin_id, title, content, imagePath);
            } else {
                result = await PostModel.createPost(admin_id, title, content);
            }
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                // Phản hồi AJAX
                return res.status(201).json({
                    message: 'Tạo bài viết thành công!',
                    post: result
                });
            } else {
                // Phản hồi HTML (redirect)
                req.flash('success', 'Tạo bài viết thành công!');
                return res.redirect('/posts');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(500).json({
                    message: 'Đã xảy ra lỗi khi tạo bài viết.',
                    error: error.message
                });
            } else {
                req.flash('error', 'Đã xảy ra lỗi khi tạo bài viết.');
                return res.redirect('/post/new');
            }
        }
    }

    // Cập nhật bài viết
    async updatePost(req, res) {
        try {
            console.log('Update post request body:', req.body);
            console.log('Update post request files:', req.files);
            console.log('Update post request params:', req.params);
            
            const postId = req.params.post_id;
            console.log('Post ID from params:', postId);
            
            const { title, content, admin_id, remove_image } = req.body;
            
            if (!postId || !admin_id || !title || !content) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Thiếu thông tin bắt buộc!' 
                });
            }
            
            // Lấy thông tin bài viết hiện tại
            const currentPost = await PostModel.getPostById(postId);
            if (!currentPost) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Không tìm thấy bài viết.' 
                });
            }
            
            // Xử lý xóa ảnh cũ nếu được yêu cầu
            if (remove_image === 'on' && currentPost.image) {
                // Xóa file ảnh cũ
                try {
                    const oldImagePath = path.join(__dirname, '../../public', currentPost.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log(`Deleted old image: ${oldImagePath}`);
                    }
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
                
                // Cập nhật bài viết mà không có ảnh
                await PostModel.updatePost(postId, admin_id, title, content);
            } 
            // Xử lý nếu có ảnh mới
            else if (req.files && req.files.image) {
                // Xóa ảnh cũ nếu có
                if (currentPost.image) {
                    try {
                        const oldImagePath = path.join(__dirname, '../../public', currentPost.image);
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                            console.log(`Deleted old image: ${oldImagePath}`);
                        }
                    } catch (err) {
                        console.error('Error deleting old image:', err);
                    }
                }
                
                // Xử lý ảnh mới
                const imageFile = req.files.image;
                const uploadDir = path.join(__dirname, '../../public/uploads/posts');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                const timestamp = Date.now();
                const fileName = `${timestamp}-${imageFile.name}`;
                const savePath = path.join(uploadDir, fileName);
                
                await imageFile.mv(savePath);
                console.log(`File uploaded to: ${savePath}`);
                
                const imagePath = `/uploads/posts/${fileName}`;
                
                // Cập nhật bài viết với ảnh mới
                await PostModel.updatePostWithImage(postId, admin_id, title, content, imagePath);
            } 
            // Không có thay đổi ảnh
            else {
                // Cập nhật thông tin cơ bản
                await PostModel.updatePost(postId, admin_id, title, content);
            }
            
            // Lấy thông tin bài viết đã cập nhật để trả về
            const updatedPost = await PostModel.getPostById(postId);
            
            // Luôn trả về JSON
            return res.status(200).json({
                success: true,
                message: 'Cập nhật bài viết thành công!',
                post: updatedPost
            });
        } catch (error) {
            console.error('Error updating post:', error);
            
            // Trả về thông báo lỗi dạng JSON
            return res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi cập nhật bài viết: ' + error.message
            });
        }
    }

    // Xóa bài viết
    async deletePost(req, res) {
        try {
            const postId = req.params.post_id;
            console.log('Delete post request params:', req.params);
            console.log('Post ID to delete:', postId);
            
            if (!postId) {
                console.error('Missing post_id parameter');
                return res.status(400).json({ 
                    success: false,
                    message: 'Missing post_id parameter' 
                });
            }
            
            // Lấy thông tin bài viết hiện tại
            let post;
            try {
                post = await PostModel.getPostById(postId);
                console.log('Found post to delete:', post ? 'Yes' : 'No');
            } catch (err) {
                console.error('Error fetching post:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error fetching post before delete',
                    error: err.message
                });
            }
            
            if (!post) {
                console.log('Post not found with ID:', postId);
                return res.status(404).json({ 
                    success: false,
                    message: 'Không tìm thấy bài viết.' 
                });
            }
            
            // Xóa ảnh nếu có
            if (post.image) {
                try {
                    const imagePath = path.join(__dirname, '../../public', post.image);
                    console.log('Checking image path:', imagePath);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log(`Deleted image: ${imagePath}`);
                    } else {
                        console.log(`Image not found at path: ${imagePath}`);
                    }
                } catch (err) {
                    console.error('Error deleting image:', err);
                    // Tiếp tục với việc xóa bài viết ngay cả khi không xóa được ảnh
                }
            }
            
            // Xóa bài viết
            try {
                await PostModel.deletePost(postId);
                console.log('Post deleted successfully, ID:', postId);
            } catch (err) {
                console.error('Error during post deletion:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error during post deletion',
                    error: err.message
                });
            }
            
            // Trả về kết quả thành công
            return res.status(200).json({
                success: true,
                message: 'Xóa bài viết thành công!'
            });
        } catch (error) {
            console.error('Error in deletePost method:', error);
            return res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi xóa bài viết.',
                error: error.message
            });
        }
    }

    // Lấy chi tiết bài viết
    // async getPostDetails(req, res) {
    //     try {
    //         const postId = req.params.post_id;
    //         console.log('Đang lấy chi tiết bài viết ID:', postId);
            
    //         // Sử dụng getPostById thay vì getPostDetailsById
    //         const post = await PostModel.getPostById(postId);
    //         console.log('Chi tiết bài viết:', post);
            
    //         if (!post) {
    //             console.log('Không tìm thấy bài viết với ID:', postId);
    //             req.flash('error', 'Không tìm thấy bài viết.');
    //             return res.redirect('/post');
    //         }
            
    //         res.render('post/post-details', { 
    //             title: post.title, 
    //             post: post 
    //         });
    //     } catch (error) {
    //         console.error('Error fetching post details:', error);
    //         req.flash('error', 'Đã xảy ra lỗi khi tải chi tiết bài viết.');
    //         res.status(500).render('post/post-details', { 
    //             title: 'Lỗi',
    //             error: 'Đã xảy ra lỗi khi tải chi tiết bài viết.'
    //         });
    //     }
    // }

    // Thêm chi tiết bài viết
    async addPostDetails(req, res) {
        try {
            const { post_id } = req.params;
            console.log(req.params);
            console.log(post_id);
            if (!post_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const { title, content, image, order_index } = req.body;
            if (!post_id || !title || !content || !order_index) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const post = await postModel.getPostId(post_id);
            if (!post) {
                return res.status(404).json({ message: 'Bài viết không tồn tại!' });
            }
            await postModel.addPostDetails(post_id, title, content, image, order_index);
            res.status(201).json({ message: 'Thêm chi tiết bài viết thành công!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    // Cập nhật chi tiết bài viết
    async updatePostDetails(req, res) {
        try {
            const { details_post_id } = req.params;
            const { title, content, image, order_index } = req.body;
            if (!details_post_id || !title || !content || !order_index) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const post = await postModel.getPostId(post_id);
            if (!post) {
                return res.status(404).json({ message: 'Bài viết không tồn tại!' });
            }
            await PostModel.updatePostDetails(details_post_id, title, content, image, order_index);
            res.status(200).json({ message: 'Cập nhật chi tiết bài viết thành công!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    // Xóa chi tiết bài viết
    async deletePostDetails(req, res) {
        try {
            const { details_post_id } = req.params;
            if (!details_post_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }

            await PostModel.deletePostDetails(details_post_id);
            res.status(200).json({ message: 'Xóa chi tiết bài viết thành công!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    // Hiển thị form chỉnh sửa bài viết
    async renderEditPostForm(req, res) {
        try {
            const postId = req.params.id;
            const post = await postModel.getPostById(postId);
            
            if (!post) {
                req.flash('error', 'Không tìm thấy bài viết.');
                return res.redirect('/posts');
            }
            
            res.render('post/edit-post', { post });
        } catch (error) {
            console.error('Error fetching post for edit:', error);
            res.status(500).send('Đã xảy ra lỗi khi tải thông tin bài viết cần chỉnh sửa.');
        }
    }
    async getPostDetailsById(req, res) {
        try {
            const postId = req.params.post_id;
            console.log(postId);
            const post = await PostModel.getPostDetailsById(postId);
            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    };
    async getAllPostsCount(req, res) {
        try {
            const count = await PostModel.getAllPostsCount();
            console.log(count);
            if (count.length === 0) {
                return res.status(404).json({ message: 'Không có bài viết nào!' });
            }
            // console.log(count);
            res.status(200).json(count);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
}

module.exports = new PostController();
