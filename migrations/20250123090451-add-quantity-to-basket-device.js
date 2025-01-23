'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('basket_devices', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Устанавливаем значение по умолчанию
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('basket_devices', 'quantity');
  }
};
