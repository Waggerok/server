'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'basket_devices', // имя таблицы
      'deviceId',       // имя нового столбца
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'devices',    // связь с таблицей devices
          key: 'id',           // связь с полем id в таблице devices
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('basket_devices', 'deviceId');
  }
};

