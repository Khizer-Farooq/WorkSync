'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shifts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      clock_in: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      clock_out: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      shift_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'REGULAR',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('shifts', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('shifts');
  },
};