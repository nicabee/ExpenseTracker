const account = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const expense = require("../models/expense");
const balance = require("../models/balances");
const instance = require("../connection");

exports.loginAccount = async (req, res) => {
  /**
   * *called for user login
   */

  await account.model
    .findOne({
      where: {
        username: req.body.username,
      },
    })
    .then(function (user) {
      if (!user) {
        /**
         * *if user does not exist in the database
         */

        res.render("index.ejs", { err: "Account does not exist" });
      } else {
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          if (isMatch) {
            expense.model
              .findAll({
                where: {
                  uuid: user.uuid,
                },
              })
              .then(function (user2) {
                if (!user2) {
                  /**
                   * * This loads the expenses under the user's uuid
                   *
                   */

                  res.render("index.ejs", { err: "Expenses not found" });
                } else {
                  /**
                   * *If login is successful, this is executed
                   */

                  /**
                   * *Query for the sum of total expenses
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
                        balance.model
                          .findOne({
                            where: {
                              uuid: user.uuid,
                            },
                          })
                          .then(function (userBalance) {
                            req.session.userBalance =
                              userBalance; /* passing the current avail balance of the user */
                            req.session.user1 =
                              user; /* passing the user information to /home */
                            req.session.expense1 =
                              user2; /* passing the expenses information to /home */
                            req.session.totalAmt =
                              totAmt; /* passing the total expenses amount to /home */
                            res.redirect("/home");
                          });
                      }
                    });
                }
              });
          } else {
            /* Goes back to login page if password is incorrect */
            res.render("index", { err: "Password is incorrect!" });
          }
        });
      }
    });
};

exports.showRegisterPage = async (req, res) => {
  let newUser = {
    username: "",
    email_address: "",
  };
  return res.render("register.ejs", {
    newUser: newUser,
  });
};
exports.createAccount = async (req, res) => {
  /**
   * * Saves the username and email address in case of errors
   * * Is rendered when register.ejs is shown again
   */
  let newUser = {
    username: req.body.username,
    email_address: req.body.email_address,
  };

  await account.model
    .findOne({
      where: {
        username: req.body.username,
      },
    })
    .then(function (user) {
      if (user) {
        res.render("register.ejs", {
          newUser: newUser,
          errors: "Username exists!",
        });
      } else {
        account.model
          .findOne({
            where: {
              email_address: req.body.email_address,
            },
          })
          .then(function (userEmailCheck) {
            if (userEmailCheck) {
              res.render("register.ejs", {
                newUser: newUser,
                errors: "Email Address exists!",
              });
            } else {
              const tok = uuidv4(); /* generates UUID */
              if (req.body.password === req.body.passwordConfirmation) {
                let salt = bcrypt.genSaltSync(10); /* for password hashing */
                account.model
                  .create({
                    uuid: tok,
                    username: req.body.username,
                    email_address: req.body.email_address,
                    password: bcrypt.hashSync(req.body.password, salt),
                  })
                  .then((user) => {
                    /**
                     *  ! to be erased
                     */
                    balance.model
                      .create({
                        uuid: tok,
                        totalAvailBalance: 0,
                      })
                      .then((userCreate) => {
                        res.render("index.ejs", {
                          status: "Successfully created an account!",
                        });
                      });
                  });
              } else {
                /* returns user to register page */
                res.render("register.ejs", {
                  newUser: newUser,
                  errors: "Passwords do not match!",
                });
              }
            }
          });
      }
    });
};
