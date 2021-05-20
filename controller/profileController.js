const account = require("../models/user");
const expense = require("../models/expense");


exports.showEditProfile = async (req, res) => {
  //  console.log(req.query.username);


    let data = await account.model.findOne(
        
        {
            where: {
                username: req.query.username
            }
        }
        
    ).then(function(user){
        if(user){
            // console.log(user.expense_category);
            // console.log(user.expense_note);
            res.render('profile.ejs', {
                uuid:user.uuid,
                username: user.username,
                email_address: user.email_address
            })
        }else{
            console.log("No records found!");
        }
    })    
}

exports.editProfile = async (req, res) => {
    //  console.log(req.body.username);
    //  console.log(req.body.email_address);
    //  console.log(req.body.user);
    // console.log(req.body.uuid);
    let data = await account.model.update(
                 {
                username: req.body.username,
                email_address: req.body.email_address
                },
            {
                where:{
                    username: req.body.user
                }
            }      
         ).then(user => {
             if(!user){
                console.log("Unable to update your profile");
             }else{
                console.log("profile updated");
                
                let data2 = expense.model.findAll(
                    {
                    where: {
                        uuid: req.body.uuid
                    },
                 }).then(user2 => {
                        if(!user2){
                            console.log("no");
                        }else{
                            console.log("yes");
                            let data3 = account.model.findOne(
                                {
                                where: {
                                    uuid: req.body.uuid
                                },
                             }).then(user3 => {
                                    if(!user3){
                                        console.log("no1");
                                    }else{
                                        console.log("yes2");
                                        
                                        req.session.user1 = user3;
                                        req.session.expense1 = user2;
                                        res.redirect("/home");
                                    }
                                })
    
                        }
                    })
             }
             
         })
     
 }