const account = require("../models/user");
const expense = require("../models/expense");
const instance = require("../connection");
const bcrypt = require("bcrypt");

exports.showResetPassword = async (req, res) => {
  /**
   * * used for displaying the page for password reset
   */
  await account.model
    .findOne({
      where: {
        username: req.query.username,
      },
    })
    .then(function (user) {
      if (user) {
        res.render("resetPassword.ejs", {
          username: user.username,
          uuid: user.uuid,
        });
      }
      /**
       * * renders the username on the password reset page
       */
    });
};

exports.resetPassword = async (req, res) => {
  /**
   * * Looks for the account with the given username
   */
  let salt = bcrypt.genSaltSync(10);
  await account.model
    .findOne({
      where: {
        username: req.params.username,
      },
    })
    .then(function (user) {
      if (user) {
        /**
         * * Compares if the old password entered and the one in the db matches
         */
        bcrypt.compare(req.body.oldpassword, user.password).then((isMatch) => {
          if (isMatch) {
            /**
             * * if old password matches with password in DB, update to new password
             * * Hash the new password before storing into DB
             */

            /**
             * * Server side validation if passwords match
             */
            if (req.body.newpassword === req.body.confirmnewpassword) {
              account.model
                .update(
                  {
                    password: bcrypt.hashSync(req.body.newpassword, salt),
                  },
                  {
                    where: {
                      username: req.params.username,
                    },
                  }
                )
                .then(function (userPass) {
                  if (userPass) {
                    res.render("profile.ejs", {
                      uuid: user.uuid,
                      username: user.username,
                      email_address: user.email_address,
                    });
                  }
                });
            } else {
              res.render("profile.ejs", {
                uuid: user.uuid,
                username: user.username,
                email_address: user.email_address,
                errors: "Your new passwords do not match!",
              });
            }
          } else {
            /**
             * * If old password input does not match password in DB,
             * * user is redirected back to profile page
             */
            res.render("profile.ejs", {
              uuid: user.uuid,
              username: user.username,
              email_address: user.email_address,
              errors: "Password does not match current password",
            });
          }
        });
      } else {
        console.log("User not found!");
      }
    });
};

exports.showEditProfile = async (req, res) => {
  /**
   * * used for displaying the page edit profile
   */
  await account.model
    .findOne({
      where: {
        username: req.query.username,
      },
    })
    .then(function (user) {
      if (user) {
        /**
         * * Renders into username and email address fields the user's
         * * current username and email address
         */
        res.render("profile.ejs", {
          uuid: user.uuid,
          username: user.username,
          email_address: user.email_address,
        });
      }
    });
};

exports.editProfile = async (req, res) => {
  /**
   * * if both username and email address wants to be changed
   */
  if (
    req.params.user != req.body.username &&
    req.params.email != req.body.email_address
  ) {
    /**
     * * finds the account in the db given the original username
     */
    account.model
      .findOne({
        where: {
          username: req.body.username,
        },
      })
      .then(function (isUserExists) {
        if (isUserExists) {
          /**
           * * if the user exists, load its expenses too
           */
          console.log("Username exists!");
          expense.model
            .findAll({
              where: {
                uuid: req.params.uuid,
              },
            })
            .then((user2) => {
              if (user2) {
                /**
                 * * user information is stored in req.session.user1
                 * * user's expenses information is stored in req.session.expense1
                 * * req.session.successful is undefined because username cannot
                 * * be changed as it already exists in the DB.
                 */
                account.model
                  .findOne({
                    where: {
                      uuid: req.params.uuid,
                    },
                  })
                  .then((user3) => {
                    if (user3) {
                      req.session.user1 = user3;
                      req.session.expense1 = user2;
                      req.session.successful = undefined;
                      req.session.error = "Username is already taken!";
                      res.redirect("/home");
                    }
                  });
              }
            });
        } else {
          /**
           * * if query is not able to select user information given the new username,
           * * this executes.
           * * Upon checking that new username is available to be used,
           * * new email address has to be checked also.
           */
          account.model
            .findOne({
              where: {
                email_address: req.body.email_address,
              },
            })
            .then(function (isEmailExists) {
              if (isEmailExists) {
                /**
                 * * If email to be changed exists, update cannot happen.
                 * * Expenses of the user will be loaded so that it still appears
                 * * when user is redirected to /home
                 */
                expense.model
                  .findAll({
                    where: {
                      uuid: req.params.uuid,
                    },
                  })
                  .then((user2) => {
                    if (user2) {
                      /**
                       * * Load the user's information from the DB
                       */
                      account.model
                        .findOne({
                          where: {
                            uuid: req.params.uuid,
                          },
                        })
                        .then((user3) => {
                          if (user3) {
                            req.session.user1 = user3;
                            req.session.expense1 = user2;
                            req.session.successful = undefined;
                            req.session.error =
                              "Email Address is already taken!";
                            res.redirect("/home");
                          }
                        });
                    }
                  });
              } else {
                /**
                 * * If new email address does not exist, then both
                 * * email and username can be updated.
                 */
                account.model
                  .update(
                    {
                      username: req.body.username,
                      email_address: req.body.email_address,
                    },
                    {
                      where: {
                        uuid: req.params.uuid,
                      },
                    }
                  )
                  .then((user) => {
                    if (user) {
                      /**
                       * * Loading the user's expenses
                       */
                      expense.model
                        .findAll({
                          where: {
                            uuid: req.params.uuid,
                          },
                        })
                        .then((user2) => {
                          if (user2) {
                            /**
                             * * Load the user's information
                             */
                            account.model
                              .findOne({
                                where: {
                                  uuid: req.params.uuid,
                                },
                              })
                              .then((user3) => {
                                if (user3) {
                                  req.session.user1 = user3;
                                  req.session.expense1 = user2;
                                  req.session.error = undefined;
                                  req.session.successful =
                                    "Email Address and Username successfully changed!";
                                  res.redirect("/home");
                                }
                              });
                          }
                        });
                    }
                  });
              }
            });
        }
      });
  } else if (req.params.email != req.body.email_address) {
    /**
     * * If user only wants to change email address
     * * First, check if new email address exists in DB
     */
    await account.model
      .findOne({
        where: {
          email_address: req.body.email_address,
        },
      })
      .then(function (userAuth) {
        if (userAuth) {
          /**
           * * Load the user expenses so that it displays in /home
           * * At this point, update is not possible as new email address
           * * already exists in the DB
           */
          expense.model
            .findAll({
              where: {
                uuid: req.params.uuid,
              },
            })
            .then((user2) => {
              if (user2) {
                /**
                 * * Load the user's information
                 */
                account.model
                  .findOne({
                    where: {
                      uuid: req.params.uuid,
                    },
                  })
                  .then((user3) => {
                    if (user3) {
                      /**
                       * * error message will be returned as email
                       * * was unsuccesfully changed
                       */
                      req.session.user1 = user3;
                      req.session.expense1 = user2;
                      req.session.successful = undefined;
                      req.session.error = "Email Address is already taken!";
                      res.redirect("/home");
                    }
                  });
              }
            });
        } else {
          /**
           * * If new email address is available for use
           */
          account.model
            .update(
              {
                email_address: req.body.email_address,
              },
              {
                where: {
                  username: req.params.user,
                },
              }
            )
            .then((user) => {
              if (user) {
                /**
                 * * Load the user's expenses
                 */
                expense.model
                  .findAll({
                    where: {
                      uuid: req.params.uuid,
                    },
                  })
                  .then((user2) => {
                    if (user2) {
                      /**
                       * * Load the user's information (updated)
                       */
                      account.model
                        .findOne({
                          where: {
                            uuid: req.params.uuid,
                          },
                        })
                        .then((user3) => {
                          if (user3) {
                            req.session.user1 = user3;
                            req.session.expense1 = user2;
                            req.session.error = undefined;
                            req.session.successful =
                              "Email Address successfully changed!";
                            res.redirect("/home");
                          }
                        });
                    }
                  });
              }
            });
        }
      });
  } else if (req.params.user != req.body.username) {
    /**
     * * if user wants to change the username only
     */
    /**
     * *check if new username exists in the DB
     */
    await account.model
      .findOne({
        where: {
          username: req.body.username,
        },
      })
      .then(function (userAuth) {
        if (userAuth) {
          /**
           * * If new username exists, update cannot go through
           * * Load the user's expenses
           */
          expense.model
            .findAll({
              where: {
                uuid: req.params.uuid,
              },
            })
            .then((user2) => {
              if (user2) {
                /**
                 * * Load the user's information
                 */
                account.model
                  .findOne({
                    where: {
                      uuid: req.params.uuid,
                    },
                  })
                  .then((user3) => {
                    if (user3) {
                      /**
                       * * error message is displayed in /home
                       */
                      req.session.user1 = user3;
                      req.session.expense1 = user2;
                      req.session.successful = undefined;
                      req.session.error = "Username is already taken!";
                      res.redirect("/home");
                    }
                  });
              }
            });
        } else {
          /**
           * * if new username is available for use, update
           */
          account.model
            .update(
              {
                username: req.body.username,
              },
              {
                where: {
                  username: req.params.user,
                },
              }
            )
            .then((user) => {
              if (user) {
                /**
                 * * Load the expenses so that it displays in /home too
                 */
                expense.model
                  .findAll({
                    where: {
                      uuid: req.params.uuid,
                    },
                  })
                  .then((user2) => {
                    if (user2) {
                      /**
                       * * Load the updated user's information
                       */
                      account.model
                        .findOne({
                          where: {
                            uuid: req.params.uuid,
                          },
                        })
                        .then((user3) => {
                          if (user3) {
                            req.session.user1 = user3;
                            req.session.expense1 = user2;
                            req.session.error = undefined;
                            req.session.successful =
                              "Username successfully changed!";
                            res.redirect("/home");
                          }
                        });
                    }
                  });
              }
            });
        }
      });
  } else {
    /**
     * * If user does not change anything but clicks on submit instead of back
     */
    /**
     * * Load user info
     */
    await account.model
      .findOne({
        where: {
          username: req.body.username,
        },
      })
      .then(function (user) {
        if (user) {
          /**
           * * user exists, load expenses
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
                 * * Once expenses are queried, get the total sum of expenses
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
                      req.session.user1 = user;
                      req.session.expense1 = user2;
                      req.session.totalAmt = totAmt;
                      req.session.successful = undefined;
                      req.session.error = undefined;
                      res.redirect("/home");
                    }
                  });
              }
            });
        }
      });
  }
};
