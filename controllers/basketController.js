const {Basket, BasketDevice, Device, User} = require('../models/models');

class BasketController {
    async getUserBasketByTelegramId(req,res) {
        try {
            const {telegram_id} = req.params;

            const user = await User.findOne({ where: {telegram_id} });
            if(!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            };
            
            const basket = await Basket.findOne({
                where: {userTelegramId : telegram_id},
                include: [
                    {
                        model: BasketDevice,
                        include: [Device]
                    }
                ]
            });

            if(!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }
            return res.status(200).json(basket)
        } catch (error) {
            console.error('Error with getting basket', error);
            return res.status(500).json({ message: 'Ошибка при получении корзины', error })
        };
    };

    async addDeviceToBasket(req, res) {
        try {
            const { telegram_id, deviceId, quantity } = req.body;
    
            let basket = await Basket.findOne({ where: { userTelegramId: telegram_id } });
            if (!basket) {
                basket = await Basket.create({ userTelegramId: telegram_id, quantity: 0});
            };
            basket.quantity += quantity;
            await basket.save();
    
            let basketDevice = await BasketDevice.create({
                basketId: basket.id,
                deviceId: deviceId,
                quantity: quantity,
            });
    
            return res.status(201).json(basketDevice);
        } catch (error) {
            console.error('Error adding device to basket:', error);
            return res.status(500).json({ message: 'Ошибка при добавлении устройства в корзину', error });
        }
    }
    

    async deleteDeviceFromBasket(req,res) {
        try {
            const {telegram_id, deviceId} = req.params;

            const basket = await Basket.findOne({ where : {userTelegramId : telegram_id} });
            if(!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' })
            };

            const basketDevice = await BasketDevice.findOne({
                where : {
                    basketId : basket.id,
                    deviceId: deviceId
                }
            });

            if (!basketDevice) {
                return res.status(404).json({ message : 'Устройства не найдено в корзине' })
            };

            await basketDevice.destroy();
            return res.status(200).json({ message: 'Устройство успешно удалено из корзины' })
        } catch (error) {
            console.error('Error deleting device from basket:' , error);
            return res.status(500).json({ message: 'Ошибка при удалении устройства из корзины' })
        }
    };

    async clearBasket(req,res) {
        try {
            const {telegram_id} = req.params;

            const basket = await Basket.findOne({ where : {userTelegramId: telegram_id} });
            if(!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            await BasketDevice.destroy({ where: {basketId: basket.id} });

            await Basket.destroy({ where: {id : basket.id} });

            return res.status(200).json({ message : 'Корзина очищена' })
        } catch (error) {
            console.error('Error clearing basket', error);
            return res.status(500).json({ message: 'Ошибка при очистке корзины', error });
        }
    }
}

module.exports = new BasketController();