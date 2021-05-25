"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "expenses", // table name
        "expense_date", // new field name
        {
          type: Sequelize.DATEONLY,
          allowNull: false,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("expenses", "expense_date"),
    ]);
  },
};
