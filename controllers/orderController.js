const {User} = require('../models/models');
const {Order} = require('../models/models');

class OrderController {
    async getUsersOrders(req, res) {
        try {   
            const { telegram_id } = req.params;
    
            // Проверяем, существует ли пользователь
            const user = await User.findOne({ where: { telegram_id } });
            if (!user) {
                return res.status(400).json({ message : 'Пользователь не найден' });
            }
    
            // Получаем заказы пользователя
            const orders = await Order.findAll({
                where: { userTelegramId: telegram_id },
                attributes: ['id', 'total_price', 'address', 'items', 'createdAt', 'updatedAt']
            });
    
            if (!orders.length) {
                return res.status(400).json({ message : 'Заказы не найдены' });
            }
    
            return res.status(200).json(orders);
        } catch (error) {
            console.error('Ошибка при получении заказов:', error);
            res.status(500).json({ message: 'Ошибка при получении заказов', error });
        }
    }
    

    async createOrder(req, res) {
        try {
            console.log("Полученные данные:", req.body);
    
            const { telegram_id, address, items } = req.body;
    
            if (!telegram_id) {
                return res.status(400).json({ message: "Ошибка: отсутствует telegram_id" });
            }
    
            // Проверяем, есть ли пользователь
            const user = await User.findOne({ where: { telegram_id } });
            if (!user) {
                return res.status(400).json({ message: "Ошибка: пользователь не найден" });
            }
    
            // Проверяем, есть ли товары в заказе
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: "Ошибка: товары не переданы" });
            }
    
            // Считаем общую стоимость
            const total_price = items.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
    
            console.log("Общая стоимость заказа:", total_price);
    
            // Создаем заказ
            const order = await Order.create({
                userTelegramId: telegram_id,
                total_price,
                address,
                items: JSON.stringify(items)
            });
    
            console.log("Заказ успешно создан:", order);
    
            return res.status(200).json({ message: "Заказ оформлен", order });
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
            return res.status(500).json({ message: "Ошибка при создании заказа", error: error.message });
        }
    }   

    async deleteOrder(req,res) {
        try {
            const {id} = req.params;

            const order = await Order.findOne({ where: {id} });
            if (!order) {
                return res.status(400).json({ message : 'Заказ не существует' });
            };

            await order.destroy();
            return res.status(200).json({ message: 'Заказ успешно удалён' });
        } catch(error) {
            console.error('Error with deleting order', error);
            res.status(500).json({ where: 'Ошибка при удалении заказа', error })
        }
    }
};

module.exports = new OrderController();