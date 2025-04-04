const pool = require('../utils/connectDB');

const getAllPosts = async () => {
    const sql = 'SELECT * FROM Posts ORDER BY created_at DESC';
    const [rows] = await pool.execute(sql);
    return rows;
};
const getAllPostsCount = async () => {
    const sql = 'SELECT COUNT(*) AS totalPosts FROM Posts';
    const [rows] = await pool.execute(sql);
    return rows[0]; // Trả về { totalPosts: số lượng }
};
const createPost = async (admin_id, title, content) => {
    const sql = 'INSERT INTO Posts (admin_id, title, content) VALUES (?, ?, ?)';
    await pool.execute(sql, [admin_id, title, content]);
};

const createPostWithImage = async (admin_id, title, content, image) => {
    const sql = 'INSERT INTO Posts (admin_id, title, content, image) VALUES (?, ?, ?, ?)';
    await pool.execute(sql, [admin_id, title, content, image]);
};

const updatePost = async (post_id, user_id, title, content) => {
    const sql = 'UPDATE Posts SET title = ?, content = ? WHERE post_id = ? AND admin_id = ?';
    await pool.execute(sql, [title, content, post_id, user_id]);
};

const updatePostWithImage = async (post_id, user_id, title, content, image) => {
    const sql = 'UPDATE Posts SET title = ?, content = ?, image = ? WHERE post_id = ? AND admin_id = ?';
    await pool.execute(sql, [title, content, image, post_id, user_id]);
};

const getPostById = async (post_id) => {
    const sql = `
        SELECT p.*, a.username, a.fullname 
        FROM Posts p
        LEFT JOIN Admin a ON p.admin_id = a.admin_id
        WHERE p.post_id = ?`;
    const [rows] = await pool.execute(sql, [post_id]);
    return rows.length > 0 ? rows[0] : null;
};

const deletePost = async (post_id) => {
    const sql = 'DELETE FROM Posts WHERE post_id = ?';
    await pool.execute(sql, [post_id]);
};

// Lấy chi tiết bài viết (sắp xếp theo `order` từ nhỏ đến lớn)
const getPostDetails = async (post_id) => {
    const sql = `
        SELECT pd.details_post_id, pd.post_id, pd.title, pd.content, pd.image, pd.order_index 
        FROM PostDetails pd 
        WHERE pd.post_id = ? 
        ORDER BY pd.order_index ASC
    `;
    const [rows] = await pool.execute(sql, [post_id]);
    return rows;
};
const getPostDetailsById = async (post_id) => {
    const sql = `
        SELECT * FROM Posts WHERE post_id = ?
    `;
    const [rows] = await pool.execute(sql, [post_id]);
    return rows;
};

// Thêm chi tiết bài viết mới
const addPostDetails = async (post_id, title, content, image, order_index) => {
    const sql = `
        INSERT INTO PostDetails (post_id, title, content, image, order_index)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [post_id, title, content, image, order_index]);
    return result;
};

// Cập nhật chi tiết bài viết
const updatePostDetails = async (details_post_id, title, content, image, order_index) => {
    const sql = `
        UPDATE PostDetails 
        SET title = ?, content = ?, image = ?, order_index = ? 
        WHERE details_post_id = ?`;
    const [result] = await pool.execute(sql, [title, content, image, order_index, details_post_id]);
    return result;
};

// Xóa chi tiết bài viết
const deletePostDetails = async (details_post_id) => {
    const sql = `DELETE FROM PostDetails WHERE details_post_id = ?`;
    const [result] = await pool.execute(sql, [details_post_id]);
    return result;
};
const getPostId = async (post_id) => {
    const sql = 'SELECT * FROM Posts WHERE post_id = ?';
    const [rows] = await pool.execute(sql, [post_id]);
    return rows.length > 0 ? rows[0] : null;
};

module.exports = {
    getPostId,
    getAllPosts,
    createPost,
    createPostWithImage,
    updatePost,
    updatePostWithImage,
    deletePost,
    getPostDetails,
    addPostDetails,
    updatePostDetails,
    deletePostDetails,
    getPostById,
    getPostDetailsById,
    getAllPostsCount,
};