const usersModel = require('../models/usersModel');
console.log(usersModel);

class UsersController {
    async getAllUsers(req, res) {
        try {
            const users = await usersModel.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async getUserByAccountId(req, res) {

        try {
            const { account_id } = req.params;
            if (!account_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const user = await usersModel.getUserByAccountId(account_id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async updateUser(req, res) {

        try {
            const { account_id } = req.params;
            const { full_name, address, avatar, date_of_birth } = req.body;
            if (!account_id || !full_name || !address || !avatar || !date_of_birth) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            await usersModel.updateUser(account_id, full_name, address, avatar, date_of_birth);
            res.status(200).json({ message: 'Cập nhật user thành công!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async getUserIdByAccountId(req, res) {
        try {
            const { account_id } = req.params;
            console.log(account_id);
            if (!account_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const userId = await usersModel.getUserIdByAccountId(account_id);
            console.log(userId);
             return res.status(200).json(userId);
        } catch (error) {
             return res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
}

module.exports = new UsersController();