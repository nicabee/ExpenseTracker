const { DataTypes } = require("sequelize");
const instance = require("../connection");

const expense = instance.sequelize.define(
  "expenses",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expense_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expense_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    expense_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expense_note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    expense_date: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    tableName: "expenses",
  }
);

exports.model = expense;
