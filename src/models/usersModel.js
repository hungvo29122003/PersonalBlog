const pool = require('../utils/connectDB');

const getAllUsers = async () => {
    const sql = 'SELECT * FROM Users';
    const [rows] = await pool.execute(sql);
    return rows;
};
const getUserByAccountId = async (account_id) => {
    const sql = 'SELECT * FROM Users WHERE account_id = ?';
    const [rows] = await pool.execute(sql, [account_id]);
    return rows[0];
};
const updateUser = async (account_id, full_name, address, avatar, date_of_birth) => {
    const sql = 'UPDATE Users SET full_name = ?, address = ?, avatar = ?, date_of_birth = ? WHERE account_id = ?';
    await pool.execute(sql, [full_name, address,avatar, date_of_birth, account_id]);
};
const userModel = {
    getUserIdByAccountId: async (account_id) => {
        try {
            const query = 'SELECT user_id FROM Users WHERE account_id = ?';
            const [rows] = await db.execute(query, [account_id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Lỗi truy vấn user_id:', error);
            throw error;
        }
    }
};
module.exports = { getAllUsers, getUserByAccountId, updateUser, userModel };