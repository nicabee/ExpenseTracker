'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('expenses', { 
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expense_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expense_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      expense_category: {
          type: Sequelize.STRING,
          allowNull: false
      },
      expense_note: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt:{
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('expenses');
  }
};
