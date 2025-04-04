const pool = require('../utils/connectDB');

const addLikeByPostID = async (user_id, post_id) => {
    const sql = 'INSERT INTO Likes (user_id, post_id) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [user_id, post_id]);
    return result.insertId;
};
const getLikeCountByPostId = async (post_id) => {
    const sql = 'SELECT COUNT(*) as like_count FROM Likes WHERE post_id = ?';
    const [rows] = await pool.execute(sql, [post_id]);
    return rows[0]?.like_count || 0;
}
const deleteLikeByID = async (like_id) => {
    const sql = 'DELETE FROM Likes WHERE like_id = ?';
    await pool.execute(sql, [like_id]);
};
const getLikeByLikeId = async (like_id) => {
    const sql = 'SELECT * FROM Likes WHERE like_id = ?';
    const [rows] = await pool.execute(sql, [like_id]);
    return rows[0];
};
const getAllLikes = async () => {
    const sql = 'SELECT COUNT(*) AS totalLikes FROM Likes';
    const [rows] = await pool.execute(sql);
    return rows[0]; // Trả về { totalLikes: số lượng }
};

module.exports = { addLikeByPostID, getLikeCountByPostId, deleteLikeByID, getLikeByLikeId, getAllLikes };
