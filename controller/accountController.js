const account = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const expense = require("../models/expense");

exports.loginAccount = async (req, res) => {
  console.log("loginAccount");
  let data = await account.model
    .findOne({
      where: {
        username: req.body.username,
      },
    })
    .then(function (user) {
      if (!user) {
        res.render("index.ejs", { err: "Account does not exist" });
      } else {
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          if (isMatch) {
            let data2 = expense.model
              .findAll({
                where: {
                  uuid: user.uuid,
                },
              })
              .then(function (user2) {
                if (!user2) {
                  console.log("Login Failed");
                } else {
                  console.log("Login Successful");
                  req.session.user1 = user;
                  req.session.expense1 = user2;
                  res.redirect("/home");
                }
              });
          } else {
            res.render("index", { err: "Password is incorrect!" });
          }
        });
      }
    });
};

exports.createAccount = async (req, res) => {
  try {
    const tok = uuidv4();
    if (req.body.password === req.body.passwordConfirmation) {
      let salt = bcrypt.genSaltSync(10);
      let data = await account.model
        .create({
          uuid: tok,
          username: req.body.username,
          email_address: req.body.email_address,
          password: bcrypt.hashSync(req.body.password, salt),
        })
        .then((user) => {
          console.log("New auto-generated ID:", user.id);
          res.render("index.ejs");
        });
    } else {
      res.render("register.ejs", { errors: "Passwords do not match!" });
    }
  } catch (err) {
    let data = await account.model
      .findOne({
        where: {
          username: req.body.username,
        },
      })
      .then(function (user) {
        if (user) {
          res.render("register.ejs", { errors: "Username exists!" });
        } else {
          let data = account.model
            .findOne({
              where: {
                email_address: req.body.email_address,
              },
            })
            .then(function (user2) {
              res.render("register.ejs", { errors: "Email Address exists!" });
            });
        }
      });
  }
};
