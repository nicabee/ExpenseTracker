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
        username: req.body.user,
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
                      username: req.body.user,
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
  //  console.log(req.body.username);
  //  console.log(req.body.email_address);
  //  console.log(req.body.user);
  // console.log(req.body.uuid);
  //console.log(req.body.email);

  if (
    req.body.user != req.body.username &&
    req.body.email != req.body.email_address
  ) {
    console.log(req.body.username);
    console.log(req.body.email_address);
    console.log("I want to change both!");
    account.model
      .findOne({
        where: {
          //email_address: req.body.email_address,
          username: req.body.username,
        },
      })
      .then(function (isUserExists) {
        if (isUserExists) {
          //username to be changed exists
          expense.model
            .findAll({
              where: {
                uuid: req.body.uuid,
              },
            })
            .then((user2) => {
              if (!user2) {
                console.log("no1");
              } else {
                console.log("yes1");
                account.model
                  .findOne({
                    where: {
                      uuid: req.body.uuid,
                    },
                  })
                  .then((user3) => {
                    if (!user3) {
                      console.log("no11");
                    } else {
                      console.log("yes22");
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
          //new username doesnt exist
          account.model
            .findOne({
              where: {
                email_address: req.body.email_address,
              },
            })
            .then(function (isEmailExists) {
              if (isEmailExists) {
                //Email Address to be changed exists
                expense.model
                  .findAll({
                    where: {
                      uuid: req.body.uuid,
                    },
                  })
                  .then((user2) => {
                    if (!user2) {
                      console.log("no1");
                    } else {
                      console.log("yes1");
                      account.model
                        .findOne({
                          where: {
                            uuid: req.body.uuid,
                          },
                        })
                        .then((user3) => {
                          if (!user3) {
                            console.log("no11");
                          } else {
                            console.log("yes22");
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
                //doesnt exist
                account.model
                  .update(
                    {
                      username: req.body.username,
                      email_address: req.body.email_address,
                    },
                    {
                      where: {
                        uuid: req.body.uuid,
                      },
                    }
                  )
                  .then((user) => {
                    if (!user) {
                      console.log("Unable to update your profile");
                    } else {
                      console.log("profile updated (email & username)");

                      expense.model
                        .findAll({
                          where: {
                            uuid: req.body.uuid,
                          },
                        })
                        .then((user2) => {
                          if (!user2) {
                            console.log("no - email & user");
                          } else {
                            console.log("yes - email & user");
                            account.model
                              .findOne({
                                where: {
                                  uuid: req.body.uuid,
                                },
                              })
                              .then((user3) => {
                                if (!user3) {
                                  console.log("no1 - email & user");
                                } else {
                                  console.log("yes2 - email & user");
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
  } else if (req.body.email != req.body.email_address) {
    console.log(req.body.username);
    console.log("Change my email address ONLY");
    let data0 = await account.model
      .findOne({
        where: {
          email_address: req.body.email_address,
        },
      })
      .then(function (userAuth) {
        if (userAuth) {
          //username to be changed exists
          expense.model
            .findAll({
              where: {
                uuid: req.body.uuid,
              },
            })
            .then((user2) => {
              if (!user2) {
                console.log("no1");
              } else {
                console.log("yes1");
                account.model
                  .findOne({
                    where: {
                      uuid: req.body.uuid,
                    },
                  })
                  .then((user3) => {
                    if (!user3) {
                      console.log("no11");
                    } else {
                      console.log("yes22");
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
          //doesnt exist
          account.model
            .update(
              {
                email_address: req.body.email_address,
              },
              {
                where: {
                  username: req.body.user,
                },
              }
            )
            .then((user) => {
              if (!user) {
                console.log("Unable to update your profile");
              } else {
                console.log("profile updated (email)");

                expense.model
                  .findAll({
                    where: {
                      uuid: req.body.uuid,
                    },
                  })
                  .then((user2) => {
                    if (!user2) {
                      console.log("no - email");
                    } else {
                      console.log("yes - email");
                      account.model
                        .findOne({
                          where: {
                            uuid: req.body.uuid,
                          },
                        })
                        .then((user3) => {
                          if (!user3) {
                            console.log("no1 - email");
                          } else {
                            console.log("yes2 - email");
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
  } else if (req.body.user != req.body.username) {
    console.log(req.body.email_address);
    console.log("Change my Username ONLY");
    let data0 = await account.model
      .findOne({
        where: {
          username: req.body.username,
        },
      })
      .then(function (userAuth) {
        if (userAuth) {
          //username to be changed exists
          expense.model
            .findAll({
              where: {
                uuid: req.body.uuid,
              },
            })
            .then((user2) => {
              if (!user2) {
                console.log("no1 - username");
              } else {
                console.log("yes1 - username");
                account.model
                  .findOne({
                    where: {
                      uuid: req.body.uuid,
                    },
                  })
                  .then((user3) => {
                    if (!user3) {
                      console.log("no11 - username");
                    } else {
                      console.log("yes22 - username");
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
          //doesnt exist
          account.model
            .update(
              {
                username: req.body.username,
              },
              {
                where: {
                  username: req.body.user,
                },
              }
            )
            .then((user) => {
              if (!user) {
                console.log("Unable to update your profile");
              } else {
                console.log("profile updated (username)");

                expense.model
                  .findAll({
                    where: {
                      uuid: req.body.uuid,
                    },
                  })
                  .then((user2) => {
                    if (!user2) {
                      console.log("no - username");
                    } else {
                      console.log("yes - username ");
                      account.model
                        .findOne({
                          where: {
                            uuid: req.body.uuid,
                          },
                        })
                        .then((user3) => {
                          if (!user3) {
                            console.log("no1 - username");
                          } else {
                            console.log("yes2 - username");
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
    // console.log("lolers");
    // console.log(req.body.username);
    // console.log(req.body.email_address);

    await account.model
      .findOne({
        where: {
          username: req.body.username,
        },
      })
      .then(function (user) {
        if (user) {
          //if username exists, load the expenses
          expense.model
            .findAll({
              where: {
                uuid: user.uuid,
              },
            })
            .then(function (user2) {
              if (user2) {
                expense.model
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

                      console.log("yess");
                      req.session.user1 = user;
                      req.session.expense1 = user2;
                      req.session.totalAmt = totAmt;
                      req.session.successful = undefined;
                      req.session.error = undefined;
                      res.redirect("/home");
                    } else {
                      console.log("No amt");
                    }
                  });
              } else {
                console.log("expenses not found");
              }
            });
        } else {
          console.log("account not found");
        }
      });
  }
};
