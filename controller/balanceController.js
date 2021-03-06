const account = require("../models/user");
const expense = require("../models/expense");
const balance = require("../models/balances");
const instance = require("../connection");

exports.showEditBalance = async (req, res) => {
  await balance.model
    .findOne({
      where: {
        uuid: req.params.uuid,
      },
    })
    .then(function (user) {
      if (user) {
        res.render("setBalance.ejs", {
          data: user,
        });
      }
    });
};

exports.editBalance = async (req, res) => {
  balance.model
    .update(
      {
        totalAvailBalance: req.body.availablebalance,
      },
      {
        where: {
          uuid: req.params.uuid,
        },
      }
    )
    .then((userTwo) => {
      if (userTwo) {
        expense.model
          .findAll({
            where: {
              uuid: req.params.uuid,
            },
          })
          .then((user3) => {
            if (user3) {
              expense.model
                .findAll({
                  where: {
                    uuid: req.params.uuid,
                  },
                  attributes: [
                    [
                      instance.sequelize.fn(
                        "sum",
                        instance.sequelize.col("expense_amount")
                      ),
                      "total_amount",
                    ],
                  ],
                })
                .then(function (totAmt) {
                  if (totAmt) {
                    balance.model
                      .findOne({
                        where: {
                          uuid: req.params.uuid,
                        },
                      })
                      .then(function (user) {
                        if (user) {
                          req.session.userBalance = user;
                          req.session.expense1 = user3;
                          req.session.totalAmt = totAmt;
                          res.redirect("/home");
                        }
                      });
                  }
                });
            }
          });
      }
    });
};
