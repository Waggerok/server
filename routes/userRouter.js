const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.post('/login', userController.authorizeUser);
router.delete('/delete/:telegram_id', userController.deleteUser);
router.put('/assignAdmin/:telegram_id', userController.assignAdmin);
router.put('/assignUser/:telegram_id', userController.assignUser);
router.get('/getUsers', userController.getAllUsers);
router.get('/getAdmins', userController.getAdmins);

module.exports = router;