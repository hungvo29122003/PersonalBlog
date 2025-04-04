const pool = require('../utils/connectDB');

// const getAllAdmins = async () => {
//     const sql = 'SELECT * FROM Admins';
//     const [rows] = await pool.execute(sql);
//     return rows;
// }
const getAllAdmins = async () => {
    const sql = `
        SELECT a.account_id, a.username, a.email, a.phone_number, 
               ad.admin_id, ad.full_name, ad.address, ad.avatar, ad.date_of_birth, 
               ad.created_at, ad.updated_at 
        FROM Admins ad
        JOIN Accounts a ON ad.account_id = a.account_id
    `;
    const [rows] = await pool.execute(sql);
    return rows;
};
const findAdminByUsername = async (full_name) => {
    const sql = 'SELECT * FROM Admins WHERE full_name = ?';
    const [rows] = await pool.execute(sql, [full_name]);
    return rows[0];
}
const findAdminByAccountId = async (account_id) => {
    const sql = 'SELECT * FROM Admins WHERE account_id = ?';
    const [rows] = await pool.execute(sql, [account_id]);
    return rows[0];
}
const deleteAdmin = async (account_id) => {
    const sql = 'DELETE FROM Admins WHERE account_id = ?';
    await pool.execute(sql, [account_id]);
};
const updateAdmin = async (admin_id, full_name, address, avatar, date_of_birth) => {
    const sql = 'UPDATE Admins SET full_name = ?, address = ?, avatar = ?, date_of_birth = ? WHERE admin_id = ?';
    await pool.execute(sql, [full_name, address, avatar, date_of_birth, admin_id]);
}

module.exports = { getAllAdmins, findAdminByUsername, deleteAdmin, updateAdmin, findAdminByAccountId };
