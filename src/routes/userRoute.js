const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
console.log(usersController);

router.get('/', usersController.getAllUsers);
router.get('/:account_id', usersController.getUserByAccountId);
router.put('/:account_id', usersController.updateUser);
router.get('/user-id/:account_id', usersController.getUserIdByAccountId);
module.exports = router;