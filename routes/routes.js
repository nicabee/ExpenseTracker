const express = require("express");
const router = express.Router();
const accountController = require("../controller/accountController");
const taskController = require("../controller/taskController");
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
        res.render("home", {data: message});

    })

  /*  router.get("/add",  (req,res) =>{
           var message = req.session.user1;
           res.render("addTask", {data: message});
 
    })

    router.get("/update", taskController.updateTask);
    router.get("/delete", taskController.deleteTask);
    router.post("/add", taskController.createTask); */
    router.post("/register", accountController.createAccount);
    router.post("/login", accountController.loginAccount);
    
    router.get("/logout",(req,res)=>{
        req.session.destroy();
        res.redirect('/')
    })
    return app.use("/", router);
}


module.exports = initWebRoutes;