const pool = require('../utils/connectDB');

const createAuthority = async (user_id, admin_id, authority) => {
    const sql = 'INSERT INTO Authorities (user_id, admin_id, authority) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [user_id || null, admin_id || null, authority]);
    return result.insertId;
};

const getAllAuthorities = async () => {
    const sql = 'SELECT * FROM Authorities';
    const [rows] = await pool.execute(sql);
    return rows;
};

const getAuthorityById = async (authority_id) => {
    const sql = 'SELECT * FROM Authorities WHERE authority_id = ?';
    const [rows] = await pool.execute(sql, [authority_id]);
    return rows[0];
};

const updateAuthority = async (authority_id, authority) => {
    const sql = 'UPDATE Authorities SET authority = ? WHERE authority_id = ?';
    await pool.execute(sql, [authority, authority_id]);
};

const deleteAuthority = async (authority_id) => {
    const sql = 'DELETE FROM Authorities WHERE authority_id = ?';
    await pool.execute(sql, [authority_id]);
};

module.exports = { createAuthority, getAllAuthorities, getAuthorityById, updateAuthority, deleteAuthority };