const { DataTypes } = require("sequelize");
const instance = require("../connection");

const expense = instance.sequelize.define(
  "balances",
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
    totalAvailBalance: {
      type: DataTypes.DOUBLE,
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
  },
  {
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    tableName: "balances",
  }
);

exports.model = expense;
