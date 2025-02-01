const express = require('express');
const router = express.Router();
const BasketController = require('../controllers/basketController');

router.get('/:telegram_id', BasketController.getUserBasketByTelegramId);

router.post('/', BasketController.addDeviceToBasket);

router.delete('/:telegram_id/device/:deviceId', BasketController.deleteDeviceFromBasket);

router.delete('/:telegram_id/clear', BasketController.clearBasket);

router.post('/updateQuantity', BasketController.updateDeviceQuantity);

router.post('/create-basket', BasketController.createBasketForUser);

module.exports = router;