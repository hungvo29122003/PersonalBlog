const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
console.log(adminController);

router.get('/accounts', adminController.getAllAdmins);

router.put('/', adminController.updateAdmin)
router.delete('/:account_id', adminController.deleteAdmin);
router.put('/:admin_id', adminController.updateAdmin);


module.exports = router;