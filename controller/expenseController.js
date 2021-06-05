const { response } = require("express");
const expense = require("../models/expense");
var user2;
const instance = require("../connection");

exports.createExpense = async (req, res) => {
  /**
   * * creates expenses info to be inserted to the db
   */
  await expense.model
    .create({
      uuid: req.params.useruuid,
      expense_name: req.body.expense_name,
      expense_amount: req.body.expense_amount,
      expense_category: req.body.expense_category,
      expense_note: req.body.expense_note,
      expense_date: req.body.expense_date,
    })
    .then((user) => {
      if (user) {
        /**
         * * if item is successfully generated
         */
        /**
         * * remove console log
         */
       
        /**
         * * Finds all the expenses of the user to be loaded when
         * * redirected back to home
         */
        expense.model
          .findAll({
            where: {
              uuid: user.uuid,
            },
          })
          .then(function (user2) {
            if (user2) {
              /**
               * * When item is created, the SUM of all expenses
               * * will also be obtained so that the updated
               * * total amount will also be rendered in /home
               */
           

              expense.model
                .findAll({
                  where: {
                    uuid: user.uuid,
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
                    /**
                     * * After getting the sum it will be passed as req.session.totalAmt
                     * * req.session.expense1 stores all the expenses of the user
                     * * which will be rendered at /home
                     */
                    req.session.expense1 = user2;
                    req.session.totalAmt = totAmt;
                    res.redirect("/home");
                  } else {
                    console.log("No amt");
                  }
                });
            }
          });
      }
    });
};

exports.showEditPage = async (req, res) => {
  /**
   * * When user chooses to edit an item, the item's id
   * * is passed which will contain the data for that item
   * * which will be rendered to editExpense.ejs
   */
  await expense.model
    .findOne({
      where: {
        id: req.query.id,
      },
    })
    .then(function (user) {
      if (user) {
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
  /**
   * * When edit button is pressed, the data
   * * on the form will be used to update the item
   * * in the db
   */
  await expense.model
    .update(
      {
        expense_name: req.body.expense_name,
        expense_amount: req.body.expense_amount,
        expense_category: req.body.expense_category,
        expense_date: req.body.expense_date,
        expense_note: req.body.expense_note,
      },
      {
        where: {
          id: req.params.userid,
        },
      }
    )
    .then((user) => {
      if (user) {
        /**
         * * When update is successful,
         * * All expenses for that user's uuid will be collected
         * * When redirected to /home, expenses list is updated
         */
        console.log("Expense Updated");
        expense.model
          .findAll({
            where: {
              uuid: req.params.uuid,
            },
          })
          .then((user2) => {
            if (user2) {
              console.log("expenses found");
              /**
               * * Get the sum of all expenses so that
               * * total expenses rendered will also be updated
               */
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
                    req.session.expense1 = user2;
                    req.session.totalAmt = totAmt;
                    res.redirect("/home");
                  }
                });
            }
          });
      }
    });
};

exports.deleteExpense = async (req, res) => {
  /**
   * * Using the id of the item,
   * * the item will be destroyed using the
   * * query below
   */
  await expense.model
    .destroy({
      where: {
        id: req.query.id,
      },
    })
    .then((user) => {
      if (user) {
        /**
         * * This query gets the items that
         * * are not deleted yet (under the user's uuid)
         * * which wil be loaded in /home
         */
        expense.model
          .findAll({
            where: {
              deletedAt: null,
              uuid: req.query.user,
            },
          })
          .then((user2) => {
            if (user2) {
              expense.model
                .findAll({
                  where: {
                    uuid: req.query.user,
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
                    req.session.expense1 = user2;
                    req.session.totalAmt = totAmt;
                    res.redirect("/home");
                  }
                });
            }
          });
      }
    });
};

exports.sortByCategory = async (req, res) => {
  /**
   * * If 'Choose Here' option is chosen,
   * * this will load all the expenses.
   * * Otherwise, it will only load depending on the category
   */

  /**
   * * If chosen option is 'Choose Here'
   */
  if (
    req.body.expense_category != "Food and Beverage" &&
    req.body.expense_category != "Education" &&
    req.body.expense_category != "Home" &&
    req.body.expense_category != "Transportation" &&
    req.body.expense_category != "Miscellaneous"
  ) {
    /**
     * * All expenses are loaded
     */
    await expense.model
      .findAll({
        where: {
          uuid: req.body.expense_category,
        },
      })
      .then(function (user) {
        if (user) {
          /**
           * * Sum of all expenses is also loaded
           */
          expense.model
            .findAll({
              where: {
                uuid: req.body.expense_category,
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
                /**
                 * * Expenses are stored in req.session.expense1
                 * * Total Amount of expenses is stored in req.session.totalAmt
                 */
                req.session.returnmsg = undefined;
                req.session.expense1 = user;
                req.session.totalAmt = totAmt;
                res.redirect("/home");
              }
            });
        }
      });
  } else {
    /**
     * * SELECTS expenses based on user's uuid AND chosen expense category
     */
    await expense.model
      .findAll({
        where: {
          uuid: req.params.uuid,
          expense_category: req.body.expense_category,
        },
      })
      .then(function (user) {
        if (user != 0) {
          /**
           * * Gets total amount of expenses for chosen category
           */
          expense.model
            .findAll({
              where: {
                uuid: req.params.uuid,
                expense_category: req.body.expense_category,
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
                req.session.returnmsg = undefined;
                req.session.expense1 = user;
                req.session.totalAmt = totAmt;
                res.redirect("/home");
              }
            });
        } else {
          expense.model
            .findAll({
              where: {
                uuid: req.params.uuid,
                expense_category: req.body.expense_category,
              },
            })
            .then(function (expenseNotExists) {
              if (expenseNotExists) {
                req.session.totalAmt = "0.00";
                req.session.expense1 = expenseNotExists;
                req.session.returnmsg = "No records found!";
                res.redirect("/home");
                console.log("No records found!");
              }
            });
        }
      });
  }
};
