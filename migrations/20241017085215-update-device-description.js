'use strict';

/** @type {import('sequelize-cli').Migration} */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Проверяем наличие колонки перед её добавлением
    const table = await queryInterface.describeTable('devices');
    
    if (!table['description_temp']) {
      await queryInterface.addColumn('devices', 'description_temp', {
        type: Sequelize.JSON,
        allowNull: true
      });
    }

    // Копируем данные из старой колонки в новую
    await queryInterface.sequelize.query(`
      UPDATE "devices"
      SET "description_temp" = to_jsonb("description"::TEXT)
    `);

    await queryInterface.removeColumn('devices', 'description');
    await queryInterface.renameColumn('devices', 'description_temp', 'description');
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('devices');
    
    if (!table['description_temp']) {
      await queryInterface.addColumn('devices', 'description_temp', {
        type: Sequelize.TEXT,
        allowNull: false
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE "devices"
      SET "description_temp" = "description"::TEXT
    `);

    await queryInterface.removeColumn('devices', 'description');
    await queryInterface.renameColumn('devices', 'description_temp', 'description');
  }
};
