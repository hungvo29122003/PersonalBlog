const userModel = require('../models/accountModel');
const bcrypt = require('bcrypt');
const auth = require('../utils/auth');

class AuthController {
    async register(req, res) {
        try {
            const {full_name, username, pass, email, phone_number } = req.body;
            const role = req.body.role || 'user';
            console.log('Request body:', req.body);
            console.log(full_name, username, pass, email, phone_number, role);
            console.log('role', role);
            
            // Kiểm tra thông tin
            if (!full_name || !username || !pass || !email) {
                return res.render('auth/register', { 
                    error: 'Vui lòng điền đầy đủ thông tin bắt buộc',
                    title: 'Register - Personal Blog'
                });
            }

            if (!['user', 'admin'].includes(role)) {
                return res.render('auth/register', { 
                    error: 'Role không hợp lệ!',
                    title: 'Register - Personal Blog'
                });
            }

            // Kiểm tra username và email đã tồn tại chưa
            const existingUser = await userModel.findUserByUsername(username);
            if (existingUser) {
                return res.render('auth/register', { 
                    error: 'Username đã tồn tại, vui lòng chọn username khác',
                    title: 'Register - Personal Blog'
                });
            }
            
            const existingEmail = await userModel.findUserByEmail(email);
            if (existingEmail) {
                return res.render('auth/register', { 
                    error: 'Email đã được sử dụng, vui lòng dùng email khác',
                    title: 'Register - Personal Blog'
                });
            }

            // Mã hóa mật khẩu và tạo tài khoản
            const hashedPassword = await bcrypt.hash(pass, 10);
            const accountId = await userModel.createUser(username, hashedPassword, email, phone_number, role, full_name);

            // Chuyển hướng với thông báo thành công
            return res.render('auth/login', { 
                success: 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.',
                title: 'Login - Personal Blog'
            });
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            return res.render('auth/register', { 
                error: 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.',
                title: 'Register - Personal Blog'
            });
        }
    }

    async login(req, res) {
        try {
            const { username, pass } = req.body;
            console.log('Request body:', req.body);
            console.log(username, pass);
            
            if (!username || !pass) {
                return res.render('auth/login', { 
                    error: 'Vui lòng nhập tên đăng nhập và mật khẩu',
                    title: 'Login - Personal Blog'
                });
            }
            
            const user = await userModel.findUserByUsername(username);

            if (!user || !(await bcrypt.compare(pass, user.pass))) {
                return res.render('auth/login', { 
                    error: 'Tên đăng nhập hoặc mật khẩu không đúng',
                    title: 'Login - Personal Blog'
                });
            }

            const accessToken = auth.generateAccessToken(user);
            
            // Giải pháp 1: Vẫn giữ token trong cookie với httpOnly để bảo mật
            res.cookie('accessToken', accessToken, { httpOnly: true });
            
            // Giải pháp 2: Tạo cookie không httpOnly chứa account_id để JavaScript có thể đọc
            res.cookie('account_id', user.account_id, { httpOnly: false });
            
            // Kiểm tra nếu request yêu cầu JSON response (từ AJAX)
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                // Giải pháp 3: Trả về JSON response với accessToken và redirectUrl
                return res.status(200).json({
                    success: true,
                    message: 'Đăng nhập thành công!',
                    accessToken,
                    account_id: user.account_id,
                    username: user.username,
                    role: user.role,
                    redirectUrl: '/home'
                });
            }
            
            // Chuyển hướng đến trang chủ sau khi đăng nhập thành công (cho form submit thông thường)
            return res.redirect('/home');
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            
            // Nếu là AJAX request, trả về lỗi dưới dạng JSON
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(500).json({ 
                    success: false,
                    error: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.'
                });
            }
            
            // Cho form submit thông thường
            return res.render('auth/login', { 
                error: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.',
                title: 'Login - Personal Blog'
            });
        }
    }

    async getAllAccounts(req, res) {
        try {
            const users = await userModel.getAllAccounts();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }

    async updateAccount(req, res) {
        try {
            const { username, pass, email, phone_number } = req.body;
            if (!username || !pass || !email || !phone_number) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            
            const hashedPassword = await bcrypt.hash(pass, 10);
            await userModel.updateAccount(username, hashedPassword, email, phone_number);
            res.status(200).json({ message: 'Cập nhật tài khoản thành công!' });
        } catch (error) {
            console.error("Lỗi cập nhật tài khoản:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }

    async getAccountByUsername(req, res) {
        try {
            const username = req.query.username;
            if (!username) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            const user = await userModel.getAccountByUsername(username);
            if (!user) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Lỗi lấy tài khoản:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }

    async deleteAccount(req, res) {
        try {
            const username = req.query.username;
            if (!username) {
                return res.status(400).json({ message: 'Thiếu thông tin!' });
            }
            await userModel.deleteAccount(username);
            res.status(200).json({ message: 'Xóa tài khoản thành công!' });
        } catch (error) {
            console.error("Lỗi xóa tài khoản:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
    
    // Phương thức hiển thị trang đăng ký
    showRegisterPage(req, res) {
        res.render('auth/register', { title: 'Register - Personal Blog' });
    }
    
    // Phương thức hiển thị trang đăng nhập
    showLoginPage(req, res) {
        res.render('auth/login', { title: 'Login - Personal Blog' });
    }
    
    // Phương thức đăng xuất
    logout(req, res) {
        res.clearCookie('accessToken');
        return res.redirect('/');
    }
    async getAccountCountByRoleUser(req, res) {
        try {
            const totalUsers = await userModel.getAccountCountByRoleUser();
            console.log('Số lượng tài khoản:', totalUsers);
            if(!totalUsers) {
                return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
            }
            res.status(200).json({ totalUsers });
        } catch (error) {
            console.error("Lỗi lấy số lượng tài khoản:", error);
            res.status(500).json({ message: 'Lỗi server!' });
        }
    }
}

module.exports = new AuthController();
