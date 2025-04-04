const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { checkAuth, checkAdmin } = require('../middlewares/middleware');
const authorityController = require('../controllers/authorityController');

// // [GET] localhost:3000/auth/users
// router.get('/users', authController.getAllUsers);

// // [POST] localhost:3000/auth/create
// router.post('/create', authController.createUser);

// // [POST] localhost:3000/auth/login
// router.post('/login', authController.login);

// // [PUT] localhost:3000/auth/update
// router.put('/update', authController.updateUser);

// // [GET] localhost:3000/auth/login
// router.get('/login', (req, res) => {
//     res.render('login');
// });
// // [GET] localhost:3000/auth/logout
// router.get('/logout', authController.logout);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/accounts', checkAuth,checkAdmin, authController.getAllAccounts);
router.put('/update', checkAuth, checkAdmin, authController.updateAccount);
router.get('/account', checkAuth,checkAdmin, authController.getAccountByUsername);
router.delete('/account', checkAuth, checkAdmin,authController.deleteAccount);
router.get('/users_count', authController.getAccountCountByRoleUser);
module.exports = router;