const { Basket, BasketDevice, Device, User } = require('../models/models');

class BasketController {
    async getUserBasketByTelegramId(req, res) {
        try {
            const { telegram_id } = req.params;

            const user = await User.findOne({ where: { telegram_id } });
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const basket = await Basket.findOne({
                where: { userTelegramId: telegram_id },
                include: [
                    {
                        model: BasketDevice,
                        include: [Device],
                    },
                ],
            });

            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            return res.status(200).json(basket);
        } catch (error) {
            console.error('Error with getting basket', error);
            return res.status(500).json({ message: 'Ошибка при получении корзины', error });
        }
    }

    async createBasketForUser(req,res) {
        try {
            const { telegram_id } = req.body;
            
            const user = await User.findOne({ where: {telegram_id} });
            if (!user) {
                return res.status(404).json({ message: 'Такого пользователя не существует' })
            }          
            
            const basket = await Basket.findOne({ where: { userTelegramId : telegram_id } });
            if (!basket) {
                basket = await Basket.create({ userTelegramId : telegram_id });
                console.log(`Корзина для пользователя ${telegram_id} успешно создана`);
            }

            return res.status(200).json({message : 'Корзина проверена/создана', basket});
        } catch(error) {
            console.error('Error during creating the basket', error);
            return res.status(500).json({ message : 'Ошибка при создании корзины', error });
        }
    }

    async addDeviceToBasket(req, res) {
        try {
            const { telegram_id, deviceId, quantity = 1 } = req.body;

            const user = await User.findOne({ where: { telegram_id } });
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            let basket = await Basket.findOne({ where: { userTelegramId: telegram_id } });
            if (!basket) {
                basket = await Basket.create({ userTelegramId: telegram_id });
            }

            let basketDevice = await BasketDevice.findOne({
                where: { basketId: basket.id, deviceId },
            });

            if (basketDevice) {
                // Увеличиваем количество, если устройство уже в корзине
                basketDevice.quantity += quantity;
                await basketDevice.save();
            } else {
                // Создаём новую запись для устройства
                basketDevice = await BasketDevice.create({
                    basketId: basket.id,
                    deviceId,
                    quantity,
                });
            }

            return res.status(201).json(basketDevice);
        } catch (error) {
            console.error('Error adding device to basket:', error);
            return res.status(500).json({ message: 'Ошибка при добавлении устройства в корзину', error });
        }
    }

    async updateDeviceQuantity(req, res) {
        try {
            const { telegram_id, deviceId, quantity } = req.body;

            const basket = await Basket.findOne({ where: { userTelegramId: telegram_id } });
            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            const basketDevice = await BasketDevice.findOne({
                where: { basketId: basket.id, deviceId },
            });

            if (!basketDevice) {
                return res.status(404).json({ message: 'Устройство не найдено в корзине' });
            }

            if (quantity < 1) {
                await basketDevice.destroy();
            } else {
                basketDevice.quantity = quantity;
                await basketDevice.save();
            }

            return res.status(200).json(basketDevice);
        } catch (error) {
            console.error('Error updating device quantity:', error);
            return res.status(500).json({ message: 'Ошибка при обновлении количества устройства', error });
        }
    }

    async deleteDeviceFromBasket(req, res) {
        try {
            const { telegram_id, deviceId } = req.params;

            const basket = await Basket.findOne({ where: { userTelegramId: telegram_id } });
            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            const basketDevice = await BasketDevice.findOne({
                where: { basketId: basket.id, deviceId },
            });

            if (!basketDevice) {
                return res.status(404).json({ message: 'Устройство не найдено в корзине' });
            }

            await basketDevice.destroy();
            return res.status(200).json({ message: 'Устройство успешно удалено из корзины' });
        } catch (error) {
            console.error('Error deleting device from basket:', error);
            return res.status(500).json({ message: 'Ошибка при удалении устройства из корзины', error });
        }
    }

    async clearBasket(req, res) {
        try {
            const { telegram_id } = req.params;

            const basket = await Basket.findOne({ where: { userTelegramId: telegram_id } });
            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            await BasketDevice.destroy({ where: { basketId: basket.id } });
            return res.status(200).json({ message: 'Корзина очищена' });
        } catch (error) {
            console.error('Error clearing basket:', error);
            return res.status(500).json({ message: 'Ошибка при очистке корзины', error });
        }
    }
}

module.exports = new BasketController();