const pool = require('../utils/connectDB');

// const getAllComments = async () => {
//     const sql = 'SELECT * FROM Comments';
//     const [rows] = await pool.execute(sql);
//     return rows;
// };
const getAllComments = async () => {
    const sql = 'SELECT COUNT(*) AS totalComments FROM Comments';
    const [rows] = await pool.execute(sql);
    return rows[0]; // Trả về { totalComments: số lượng }
};

const addComment = async (post_id, user_id, content, parent_id = null) => {
    const sql = 'INSERT INTO Comments (post_id, user_id, content, parent_id) VALUES (?, ?, ?,?)';
    await pool.execute(sql, [post_id, user_id, content, parent_id]);
};

const updateComment = async (comment_id, content) => {
    const sql = 'UPDATE Comments SET content = ? WHERE comment_id = ?';
    await pool.execute(sql, [content, comment_id]);
};

const deleteComment = async (comment_id, user_id) => {
    const sql = 'DELETE FROM Comments WHERE comment_id = ? AND user_id = ?';
    await pool.execute(sql, [comment_id, user_id]);
};
// const getCommentByPostId = async (post_id) => {
//     const sql = 'SELECT * FROM Comments WHERE post_id = ?';
//     const [rows] = await pool.execute(sql, [post_id]);
//     return rows;
// };
const getCommentByPostId = async (post_id) => {
    const sql = 'SELECT * FROM Comments WHERE post_id = ? ORDER BY created_at ASC';
    const [comments] = await pool.execute(sql, [post_id]);

    // Xây dựng cấu trúc cây bình luận
    const commentTree = {};
    comments.forEach(comment => {
        comment.replies = [];
        commentTree[comment.comment_id] = comment;
    });

    return comments.filter(comment => {
        if (comment.parent_id) {
            commentTree[comment.parent_id]?.replies.push(comment);
            return false;
        }
        return true;
    });
};
const getCommentById = async (comment_id) => {
    const sql = 'SELECT * FROM Comments WHERE comment_id = ?';
    const [rows] = await pool.execute(sql, [comment_id]);
    return rows[0];
};
const getCommentByPostId1 = async (post_id) => {
    const sql = 'SELECT COUNT(*) AS total_comments FROM Comments WHERE post_id = ?';
    const [rows] = await pool.execute(sql, [post_id]);
    return rows[0].total_comments;
};

module.exports = { getCommentByPostId1,getAllComments, addComment, updateComment, deleteComment, getCommentByPostId, getCommentById };
