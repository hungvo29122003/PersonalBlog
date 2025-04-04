const authorityModel = require('../models/authorityModel');

class AuthorityController {
    async createAuthority(req, res) {
        try {
            const { user_id, admin_id, authority } = req.body;

            if ((!user_id && !admin_id) || !authority) {
                return res.status(400).json({ message: 'Cần nhập ít nhất user_id hoặc admin_id, và authority!' });
            }

            const authority_id = await authorityModel.createAuthority(user_id, admin_id, authority);

            res.status(201).json({
                message: 'Tạo quyền thành công!',
                authority_id
            });
        } catch (error) {
            console.error('Lỗi khi tạo Authority:', error);
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    async getAllAuthorities(req, res) {
        try {
            const authorities = await authorityModel.getAllAuthorities();
            res.status(200).json(authorities);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách Authorities:', error);
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    async getAuthorityById(req, res) {
        try {
            const { authority_id } = req.params;
            const authority = await authorityModel.getAuthorityById(authority_id);

            if (!authority) {
                return res.status(404).json({ message: 'Không tìm thấy quyền này!' });
            }

            res.status(200).json(authority);
        } catch (error) {
            console.error('Lỗi khi lấy Authority:', error);
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    async updateAuthority(req, res) {
        try {
            const { authority_id } = req.params;
            const { authority } = req.body;

            if (!authority) {
                return res.status(400).json({ message: 'Cần nhập authority!' });
            }

            await authorityModel.updateAuthority(authority_id, authority);
            res.status(200).json({ message: 'Cập nhật quyền thành công!' });
        } catch (error) {
            console.error('Lỗi khi cập nhật Authority:', error);
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }

    async deleteAuthority(req, res) {
        try {
            const { authority_id } = req.params;
            await authorityModel.deleteAuthority(authority_id);
            res.status(200).json({ message: 'Xóa quyền thành công!' });
        } catch (error) {
            console.error('Lỗi khi xóa Authority:', error);
            res.status(500).json({ message: 'Lỗi server!', error });
        }
    }
}
module.exports = new AuthorityController;