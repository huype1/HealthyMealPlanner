'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('dishes', "average_rating", {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    await queryInterface.addColumn('dishes', "ratings", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("dishes", 'average_rating');
    await queryInterface.removeColumn('dishes', 'ratings');
  }
};
