const { response } = require("express");
const expense = require("../models/expense");
const instance = require("../connection");

exports.showHistory = async (req, res) => {
  console.log(req.params.uuid);
  await expense.model
    .findAll({
      where: {
        uuid: req.params.uuid,
      },
      paranoid: false,
    })
    .then((userHistory) => {
      res.render("expensesHistory.ejs", {
        uuid: req.params.uuid,
        username: req.params.username,
        expenses: userHistory,
      });
    });
};
