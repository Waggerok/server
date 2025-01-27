const {User} = require('../models/models');
const {Order} = require('../models/models');

class OrderController {
    async getUsersOrders(req,res) {
        try {   
            const { telegram_id } = req.params;

            const user = await User.findOne({ where: {telegram_id} });
            if (!user) {
                return res.status(400).json({ message : 'Пользователь не найден' });
            };

            const orders = await Order.findAll({ where: { userTelegramId: telegram_id } });
            if (!orders.length) {
                return res.status(400).json({ message : 'Заказы не найдены' });
            };

            return res.status(200).json(orders);
        } catch(error) {
            console.error('Error fetching orders', error);
            res.status(500).json( { message : 'Ошибка при получении заказов', error});
        };
    };

    async createOrder(req,res) {
        try {
            const { telegram_id, address, total_price } = req.body;

            const user = await User.findOne({ where: {telegram_id} });
            if (!user) {
                return res.status(400).json({ message : 'Пользователя не существует' });
            };

            const order = await Order.create({
                telegram_id,
                address,
                total_price
            });

            return res.status(201).json( {message : 'Заказ успешно создан', order});
        } catch(error) {
            console.error('Error with creating order', error);
            res.status(500).json( { message: 'Заказ не создался', error});
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