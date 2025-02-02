//Imports
const sequelize = require('../data/database');
const {DataTypes} = require('sequelize');

//Models

const User = sequelize.define('user', {
    telegram_id : {type : DataTypes.STRING, primaryKey: true, unique: true},
    role : {type : DataTypes.STRING, defaultValue: 'USER'}
});

const Order = sequelize.define('order', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    total_price : {type: DataTypes.FLOAT, allowNull: false},
    address : {type: DataTypes.STRING, allowNull: false},
    items: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] }
});

const Basket = sequelize.define('basket', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    userTelegramId : { type : DataTypes.STRING, allowNull: false, unique: true },
    quantity : {type: DataTypes.INTEGER, allowNull: true, defaultValue: 1},
});

const Device = sequelize.define('device', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name : {type: DataTypes.STRING, unique: true, allowNull: false},
    description : {type: DataTypes.JSON, allowNull: false},
    price : {type: DataTypes.INTEGER, allowNull: false},
    image : {type: DataTypes.STRING, allowNull: true},
    model3D : {type: DataTypes.STRING, allowNull: true},
    quantity : {type: DataTypes.INTEGER, allowNull: false}
});

const BasketDevice = sequelize.define('basket_device', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    deviceId : {type: DataTypes.INTEGER, allowNull: false, references: {model: Device, key: 'id'}},
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // Новое поле
});

const DeviceFilter = sequelize.define('device_filter', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    device_type : {type: DataTypes.STRING, unique: true, allowNull: false}
});

const MacbookFilter = sequelize.define('macbook_filter', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    processor : {type: DataTypes.STRING, allowNull: false},
    ram : {type: DataTypes.INTEGER, allowNull: false}
});

const IpadFilter = sequelize.define('ipad_filter', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    cellular: {type: DataTypes.BOOLEAN, allowNull: false},
    processor : {type: DataTypes.STRING, allowNull: false}
});

//Connections
User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(Basket);
Basket.belongsTo(Order);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

BasketDevice.hasMany(Device);
Device.belongsTo(BasketDevice);

Device.hasMany(DeviceFilter);
DeviceFilter.belongsTo(Device);

DeviceFilter.hasOne(MacbookFilter);
MacbookFilter.belongsTo(DeviceFilter);

DeviceFilter.hasOne(IpadFilter);
IpadFilter.belongsTo(DeviceFilter);






module.exports = {
    User,
    Order,
    Basket,
    BasketDevice,
    Device,
    DeviceFilter,
    MacbookFilter,
    IpadFilter,
}