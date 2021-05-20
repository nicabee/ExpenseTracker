const express = require("express");
const router = express.Router();
const accountController = require("../controller/accountController");
const expenseController = require("../controller/expenseController");
const profileController = require("../controller/profileController");
var session = require('express-session');




let initWebRoutes = (app) => {
    router.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

    router.get("/", (req,res) =>{
        res.render("index");
    })
    router.get("/login", (req,res) =>{
        res.render("index");
    })

    router.get("/register", (req,res) =>{
        res.render("register");
    })
   
    
    router.get("/home",  (req,res) =>{
        var message = req.session.user1;
        var expense = req.session.expense1;
        res.render("home", {data: message, expenses: expense});

    })

    router.get("/add",  (req,res) =>{
        var message = req.session.user1;
        res.render("addExpense", {data: message});
 
    })

    router.get("/update", expenseController.showEditPage);
    router.post("/update", expenseController.UpdateExpense);
    router.post("/sortByCategory", expenseController.sortByCategory);
    router.get("/delete", expenseController.deleteExpense);
    router.post("/add", expenseController.createExpense); 
    router.post("/register", accountController.createAccount);

    router.get("/editProfile", profileController.showEditProfile);
    router.post("/editProfile", profileController.editProfile);

    router.post("/login", accountController.loginAccount);
    
    router.get("/logout",(req,res)=>{
        req.session.destroy();
        res.redirect('/')
    })
    return app.use("/", router);
}


module.exports = initWebRoutes;