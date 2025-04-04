const pool = require('../utils/connectDB');

const getAllAccounts = async () => {
    const sql = 'SELECT * FROM Accounts';
    const [rows] = await pool.execute(sql);
    return rows;
};

const findUserByUsername = async (username) => {
    const sql = 'SELECT * FROM Accounts WHERE username = ?';
    const [rows] = await pool.execute(sql, [username]);
    return rows[0];
};
const findUserByEmail = async (email) => {
    const sql = 'SELECT * FROM Accounts WHERE email = ?';
    const [rows] = await pool.execute(sql, [email]);
    return rows[0];
}

const createUser = async (username, hashedPassword, email, phone_number, role) => {
    const sql = 'INSERT INTO Accounts (username, pass, email, phone_number, role) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [username, hashedPassword, email, phone_number, role]);

    const accountId = result.insertId; // Lấy ID của tài khoản vừa tạo

    if (role === 'user') {
        await pool.execute('INSERT INTO Users (account_id, full_name) VALUES (?, ?)', [accountId, username]);
    } else if (role === 'admin') {
        await pool.execute('INSERT INTO Admins (account_id, full_name) VALUES (?, ?)', [accountId, username]);
    }

    return accountId;
};


const updateAccount = async (username, hashedPassword, email, phone_number) => {
    const sql = 'UPDATE Accounts SET pass = ?, email = ?, phone_number = ? WHERE username = ?';
    await pool.execute(sql, [hashedPassword, email, phone_number, username]);
};

const getAccountByUsername = async (username) => {
    const sql = 'SELECT * FROM Accounts WHERE username = ?';
    const [rows] = await pool.execute(sql, [username]);
    return rows[0];
};

const deleteAccount = async (username) => {
    const sql = 'DELETE FROM Accounts WHERE username = ?';
    await pool.execute(sql, [username]);
};
const getAccountCountByRoleUser = async () => {
    const sql = 'SELECT COUNT(*) AS totalUsers FROM Accounts WHERE role = ?';
    const [rows] = await pool.execute(sql, ['user']);
    return rows[0].totalUsers;
}
module.exports = { getAccountCountByRoleUser ,getAllAccounts, findUserByUsername, createUser, updateAccount, getAccountByUsername, deleteAccount, findUserByEmail };
