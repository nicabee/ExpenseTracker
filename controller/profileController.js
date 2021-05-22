const account = require("../models/user");
const expense = require("../models/expense");

exports.showEditProfile = async (req, res) => {
  //  console.log(req.query.username);

  await account.model
    .findOne({
      where: {
        username: req.query.username,
      },
    })
    .then(function (user) {
      if (user) {
        // console.log(user.expense_category);
        // console.log(user.expense_note);
        res.render("profile.ejs", {
          uuid: user.uuid,
          username: user.username,
          email_address: user.email_address,
        });
      } else {
        console.log("No records found!");
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
  }
};
