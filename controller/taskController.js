const { response } = require("express");
const task = require("../models/task");
var user2;
exports.createTask = async (req, res) => {
 
        
        let data = await task.model.create({
            uuid: req.body.uuid,
            task: req.body.task,
            description: req.body.desc,
            status: "pending"
            }      
        ).then(user => {
            if(!user){
                console.log("oopps");
            }else{
                console.log("Task Generated");
                let data2 = task.model.findAll(
                    {
                    where: {
                        uuid: user.uuid
                    }
                }).then(function(user2){
                    if(!user2){
                        console.log("Task Creation Failed");
                    }else{
                        console.log("Task Creation Successful");
                        req.session.usertwo = user2;
                        res.redirect("/home");
                    }
                })

            }
            
        })
        
   
}

exports.updateTask = async (req, res) => {
        console.log(req.query.user);
         let data = await task.model.update(
             {status: "completed"},
            {
                where:{
                    id: req.query.id
                }
            }      
         ).then(user => {
             if(!user){
                console.log("Unable to update status");
             }else{
                console.log("Task Status Updated");
                let data2 = task.model.findAll(
                    {
                    where: {
                        uuid: req.query.user
                    },
                 }).then(user2 => {
                        if(!user2){
                            console.log("task cant be found");
                        }else{
                            console.log("task found");
                            req.session.usertwo = user2;
                            res.redirect("/home");
                        }
                    })
             }
             
         })
 }

 exports.deleteTask = async (req, res) => {
     console.log(req.query.user);
     let data = await task.model.destroy(
        {
            where:{
                id: req.query.id
            }
        }      
     ).then(user => {
         if(!user){
            console.log("oopps");
         }else{
            console.log("Task Deleted");
            let data2 = task.model.findAll(
                {
                where: {
                    deletedAt: null,
                    uuid: req.query.user
                },
             }).then(user2 => {
                    if(!user2){
                        console.log("task not found");
                    }else{
                        console.log("task found");
                        req.session.usertwo = user2;
                        res.redirect("/home");
                    }
                })
         }
         
     })
}