const { response } = require("express");
const expense = require("../models/expense");
var user2;
const instance = require("../connection");

exports.createExpense = async (req, res) => {
  let data = await expense.model
    .create({
      uuid: req.body.uuid,
      expense_name: req.body.expense_name,
      expense_amount: req.body.expense_amount,
      expense_category: req.body.expense_category,
      expense_note: req.body.expense_note,
      expense_date: req.body.expense_date,
    })
    .then((user) => {
      if (!user) {
        console.log("oopps");
      } else {
        console.log("Expense Generated");
        let data2 = expense.model
          .findAll({
            where: {
              uuid: user.uuid,
            },
          })
          .then(function (user2) {
            if (!user2) {
              console.log("Expense Creation Failed");
            } else {
              console.log("Expense Creation Successful");

              let totalAmount = expense.model
                .findAll({
                  where: {
                    uuid: user.uuid,
                  },
                  attributes: [
                    // "expense_category",
                    [
                      instance.sequelize.fn(
                        "sum",
                        instance.sequelize.col("expense_amount")
                      ),
                      "total_amount",
                    ],
                  ],
                  //group: ["expense_category"],
                })
                .then(function (totAmt) {
                  if (totAmt) {
                    console.log("Yes amt");
                    //console.log(totAmt);
                    //req.session.user1 = user;
                    req.session.expense1 = user2;
                    req.session.totalAmt = totAmt;
                    res.redirect("/home");
                  } else {
                    console.log("No amt");
                  }
                });

              //req.session.expense1 = user2;
              //res.redirect("/home");
            }
          });
      }
    });
};

exports.showEditPage = async (req, res) => {
  console.log(req.query.user);
  console.log(req.query.id);

  let data = await expense.model
    .findOne({
      where: {
        id: req.query.id,
      },
    })
    .then(function (user) {
      if (user) {
        console.log(user.expense_category);
        console.log(user.expense_note);
        res.render("editExpense.ejs", {
          userid: user.id,
          uuid: user.uuid,
          expenseName: user.expense_name,
          expenseAmount: user.expense_amount,
          expenseCategory: user.expense_category,
          expenseDate: user.expense_date,
          expenseNote: user.expense_note,
        });
      } else {
        console.log("No records found!");
      }
    });
};

exports.UpdateExpense = async (req, res) => {
  //  console.log(req.body.expense_name);
  //  console.log(req.body.expense_amount);
  //  console.log(req.body.expense_category);
  //  console.log(req.body.expense_note);
  //  console.log(req.body.userid);
  let data = await expense.model
    .update(
      {
        //status: "completed",
        expense_name: req.body.expense_name,
        expense_amount: req.body.expense_amount,
        expense_category: req.body.expense_category,
        expense_date: req.body.expense_date,
        expense_note: req.body.expense_note,
      },
      {
        where: {
          id: req.body.userid,
        },
      }
    )
    .then((user) => {
      if (!user) {
        console.log("Unable to update expense");
      } else {
        console.log("Expense Updated");
        let data2 = expense.model
          .findAll({
            where: {
              uuid: req.body.uuid,
            },
          })
          .then((user2) => {
            if (!user2) {
              console.log("expense cant be found");
            } else {
              console.log("task found");

              let totalAmount = expense.model
                .findAll({
                  where: {
                    uuid: req.body.uuid,
                  },
                  attributes: [
                    // "expense_category",
                    [
                      instance.sequelize.fn(
                        "sum",
                        instance.sequelize.col("expense_amount")
                      ),
                      "total_amount",
                    ],
                  ],
                  //group: ["expense_category"],
                })
                .then(function (totAmt) {
                  if (totAmt) {
                    console.log("Yes amt");
                    //console.log(totAmt);
                    //req.session.user1 = user;
                    req.session.expense1 = user2;
                    req.session.totalAmt = totAmt;
                    res.redirect("/home");
                  } else {
                    console.log("No amt");
                  }
                });

              // req.session.expense1 = user2;
              // res.redirect("/home");
            }
          });
      }
    });
};

exports.deleteExpense = async (req, res) => {
  console.log(req.query.user);
  let data = await expense.model
    .destroy({
      where: {
        id: req.query.id,
      },
    })
    .then((user) => {
      if (!user) {
        console.log("oopps");
      } else {
        console.log("Expense Deleted");
        let data2 = expense.model
          .findAll({
            where: {
              deletedAt: null,
              uuid: req.query.user,
            },
          })
          .then((user2) => {
            if (!user2) {
              console.log("expense not found");
            } else {
              console.log("expense found");

              let totalAmount = expense.model
                .findAll({
                  where: {
                    uuid: req.query.user,
                  },
                  attributes: [
                    // "expense_category",
                    [
                      instance.sequelize.fn(
                        "sum",
                        instance.sequelize.col("expense_amount")
                      ),
                      "total_amount",
                    ],
                  ],
                  //group: ["expense_category"],
                })
                .then(function (totAmt) {
                  if (totAmt) {
                    console.log("Yes amt");
                    //console.log(totAmt);
                    //req.session.user1 = user;
                    req.session.expense1 = user2;
                    req.session.totalAmt = totAmt;
                    res.redirect("/home");
                  } else {
                    console.log("No amt");
                  }
                });

              // req.session.expense1 = user2;
              // res.redirect("/home");
            }
          });
      }
    });
};

exports.sortByCategory = async (req, res) => {
  // console.log(req.body.expense_category);
  console.log(req.body.uuiduser);
  if (
    req.body.expense_category != "Food and Beverage" &&
    req.body.expense_category != "Education" &&
    req.body.expense_category != "Home" &&
    req.body.expense_category != "Transportation" &&
    req.body.expense_category != "Miscellaneous"
  ) {
    let data = await expense.model
      .findAll({
        where: {
          uuid: req.body.expense_category,
        },
      })
      .then(function (user) {
        if (user) {
          let totalAmount = expense.model
            .findAll({
              where: {
                uuid: req.body.expense_category,
              },
              attributes: [
                // "expense_category",
                [
                  instance.sequelize.fn(
                    "sum",
                    instance.sequelize.col("expense_amount")
                  ),
                  "total_amount",
                ],
              ],
              //group: ["expense_category"],
            })
            .then(function (totAmt) {
              if (totAmt) {
                console.log("Yes amt");
                //console.log(totAmt);
                //req.session.user1 = user;
                req.session.expense1 = user;
                req.session.totalAmt = totAmt;
                res.redirect("/home");
              } else {
                console.log("No amt");
              }
            });
          // req.session.expense1 = user;
          // res.redirect("/home");
        } else {
          console.log("No records found!");
        }
      });
  } else {
    let data = await expense.model
      .findAll({
        where: {
          uuid: req.body.uuiduser,
          expense_category: req.body.expense_category,
        },
      })
      .then(function (user) {
        if (user) {
          let totalAmount = expense.model
            .findAll({
              where: {
                uuid: req.body.uuiduser,
                expense_category: req.body.expense_category,
              },
              attributes: [
                // "expense_category",
                [
                  instance.sequelize.fn(
                    "sum",
                    instance.sequelize.col("expense_amount")
                  ),
                  "total_amount",
                ],
              ],
              //group: ["expense_category"],
            })
            .then(function (totAmt) {
              if (totAmt) {
                console.log("Yes amt");
                //console.log(totAmt);
                //req.session.user1 = user;
                req.session.expense1 = user;
                req.session.totalAmt = totAmt;
                res.redirect("/home");
              } else {
                console.log("No amt");
              }
            });

          // req.session.expense1 = user;
          // res.redirect("/home");
        } else {
          console.log("No records found!");
        }
      });
  }
};
