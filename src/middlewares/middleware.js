const auth = require('../utils/auth');
const db = require('../utils/connectDB');
const checkAuth = (req, res, next) =>{
    // const token = req.headers.authorization?.split(' ')[1];
    // Lấy token từ cookie
    const token = req.cookies.accessToken;
    const checkUser = auth.verifyAccsessToken(token);
    if (!checkUser){
        return res.status(403).json('Chưa đăng nhập');
    }
    console.log('User Info:', checkUser); // Kiểm tra payload của token
    req.user = checkUser;
    next();
};
const checkAdmin = (req, res, next) => {
    try {
        const { role } = req.user; // Lấy role từ token

        if (role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server!', error });
    }
};
module.exports = {
    checkAuth,
    checkAdmin
}