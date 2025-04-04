const adminModel = require('../models/adminModel');

class AdminController {
    async getAllAdmins(req, res) {
        try {
            const admins = await adminModel.getAllAdmins();
            res.status(200).json(admins);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async getAdminByUsername(req, res) {

        try {
            const { username } = req.params;
            if (!username) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const admin = await adminModel.findAdminByUsername(username);
            res.status(200).json(admin);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async updateAdmin(req, res) {

        try {
            const { admin_id } = req.params;
            console.log(req.params);
            console.log(admin_id);
            const { full_name, address, avatar, date_of_birth } = req.body;
            console.log(req.body);
            console.log(full_name, address, avatar, date_of_birth);
            if (!admin_id || !full_name || !address || !avatar || !date_of_birth) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            await adminModel.updateAdmin(admin_id, full_name, address, avatar, date_of_birth);
            res.status(200).json({ message: 'Cập nhật admin thành công!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
    async deleteAdmin(req, res) {

        try {
            const  account_id = req.params.account_id;
            console.log(account_id);
            if (!account_id) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const admin = adminModel.findAdminByAccountId(account_id);
            if (!admin) {
                return res.status(400).json({ message: 'Không tồn tại!' });
            }
            await adminModel.deleteAdmin(account_id);
            res.status(200).json({ message: 'Xóa admin thành công!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
}
module.exports = new AdminController;