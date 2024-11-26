'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('recipes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      step: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dish_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dishes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('recipes');
  }
};