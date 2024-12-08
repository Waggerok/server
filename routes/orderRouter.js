const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.get('/orders/:telegram_id', orderController.getUsersOrders)
router.post('/orders', orderController.createOrder);
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;