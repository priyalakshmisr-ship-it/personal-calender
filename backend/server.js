const express = require("express")
const cors = require("cors")
const path = require("path")
const bcrypt = require("bcryptjs")
const fs = require('fs')
const databasePath = '../database/activityData.json'
const userDatabasePath = '../database/users.json'

const app = express()
app.use(express.json())  

app.get('/',function(req,res){
    res.sendFile('C:/Users/mihir/OneDrive/Desktop/Classes/Pranessh Web Dev Classes/Personal Calendar/frontend/landing.html')
})

app.get('/personalCalendar',function(req,res){
    res.sendFile('C:/Users/mihir/OneDrive/Desktop/Classes/Pranessh Web Dev Classes/Personal Calendar/frontend/index.html')
})

app.post('/receiveSignup', function(req,res){
    var username = req.body.username
    var password = req.body.password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    var userDatabaseFile = fs.readFileSync(userDatabasePath,"utf-8")
    var userDatabaseArray = JSON.parse(userDatabaseFile)
     var item = false
    for(i=0;i<userDatabaseArray.length;i=i+1){        
        if(userDatabaseArray[i].username == username){             
             item = true 
             break
        }       
    }
    if(item == true){
        res.send("Username already exists")
    }
    else if(item == false){
        var obj = {
            "username" : username,
            "password" : hash
        }
        userDatabaseArray.push(obj)
        fs.writeFileSync(userDatabasePath, JSON.stringify(userDatabaseArray))
        res.send("Account created")
    }
})

app.post('/receiveSignin', function(req,res){
    var username = req.body.username
    var password = req.body.password
    var userDatabaseFile = fs.readFileSync(userDatabasePath,"utf-8")
    var userDatabaseArray = JSON.parse(userDatabaseFile)
    var item = false
    var passwordMatch = false
    for(i=0;i<userDatabaseArray.length;i=i+1){        
        if(userDatabaseArray[i].username == username){             
             item = true 
             if(bcrypt.compareSync(password, userDatabaseArray[i].password) == true){
                passwordMatch = true
             }
             break
        }       
    }
    if(item == true && passwordMatch == true){        
        res.send("Success")
    }
    else if(item == false){
        res.send("Username does not exist go sign up")
    }
    else if(item == true && passwordMatch == false)[
        res.send("The password is wrong")
    ]
})

app.post("/sendActivity", function(req, res){
    var username = req.body.username
    var activity = req.body.activity
    var date = req.body.date

    var activityObject = {
        "activity" : activity,
        "date": date
    }
    var databaseFile = fs.readFileSync(databasePath,"utf-8")
    var databaseObj = JSON.parse(databaseFile)
     var item = false
    for( i in databaseObj ){
        console.log(i)
        console.log(databaseObj[i])
        
        if(i == username){
             databaseObj[i].push(activityObject)
             item = true 
             break
        }
       
    }
    if(item == false){
        databaseObj[username] = [activityObject]
    }
    fs.writeFileSync(databasePath, JSON.stringify(databaseObj))
})   

app.listen(2530, function () {
    console.log("Server has started");
}); 