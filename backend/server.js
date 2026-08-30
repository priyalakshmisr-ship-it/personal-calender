const express = require("express")
const cors = require("cors")
const path = require("path")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")
const fs = require('fs')
const databasePath = path.join(__dirname,"..","database","activityData.json")
const userDatabasePath = path.join(__dirname,"..","database","users.json")

const app = express()
app.use(express.json())  
app.use(cookieParser())
const salt = bcrypt.genSaltSync(10)
app.get('/',function(req,res){
    console.log(__dirname) 
    res.sendFile(path.join(__dirname,"..","frontend","landing.html"))
})

app.get('/treasureLink',
function(req,res,next){
    var password = req.query.password  
    if(password == "Pranessh"){
        next() //This is a special function that the middleware functions get as the third parameter and using this function we are able to go the next available function
    } 
}, //security function which will stop us from going to the treasure function and we call this the middleware function
function(req,res){
    res.send("You found the treasure") //treasure function
}
)

app.get('/personalCalendar',
function(req, res, next){
    var username = req.cookies.username
    var password = req.cookies.password  
    var userDatabaseFile = fs.readFileSync(userDatabasePath,"utf-8")
    var userDatabaseArray = JSON.parse(userDatabaseFile)
    var item = false
    var passwordMatch = false
    for(i=0;i<userDatabaseArray.length;i=i+1){        
        if( username === userDatabaseArray[i].username){
            item = true 
            if(password == userDatabaseArray[i].password){
                passwordMatch = true
            }
            break
        }       
    }
    if(item == true && passwordMatch == true){
        next()
    }
    else{
        res.redirect("/")
    }
},
function(req,res){
    res.sendFile(path.join(__dirname,"..","frontend","index.html")) //treasure function
})

app.post('/receiveSignup', function(req,res){
    var username = req.body.username
    var password = req.body.password
    
    const passwordhash = bcrypt.hashSync(password, salt);
   // const usernamehash = bcrypt.hashSync(username, salt);
    var userDatabaseFile = fs.readFileSync(userDatabasePath,"utf-8")
    var userDatabaseArray = JSON.parse(userDatabaseFile)
  

     var item = false
    for(i=0;i<userDatabaseArray.length;i=i+1){        
        if( username === userDatabaseArray[i].username ){  
                      
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
            "password" : passwordhash
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
    var stored_password=""
    for(i=0;i<userDatabaseArray.length;i=i+1){        
        if(username === userDatabaseArray[i].username ){             
             item = true 
             
             if(bcrypt.compareSync(password, userDatabaseArray[i].password) == true){
                passwordMatch = true 
                stored_password=userDatabaseArray[i].password
             }
             break
        }       
    }
    if(item == true && passwordMatch == true){ 
        const password = stored_password
        
        res.cookie("username", username)
        res.cookie("password", password)       
        res.send("Success")

    }
    else if(item == false){
        res.send("Username does not exist go sign up")
    }
    else if(item == true && passwordMatch == false)[
        res.send("The password is wrong")
    ] 
})

app.get("/getAllActivities", function(req,res){
    var activityDatabaseFile= fs.readFileSync(databasePath,"utf-8")
    var activityDatabaseObject= JSON.parse(activityDatabaseFile)
    var username = req.cookies.username
    var activity = activityDatabaseObject[username] 
    res.json(activity)
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
app.post("/Receivedeletion", function(req , res){
 var username = req.body.username
    var activity = req.body.activity
    var DatabaseFile = fs.readFileSync(databasePath,"utf-8")
    var activityDatabaseObject= JSON.parse(DatabaseFile)
    
  var activityArray = activityDatabaseObject[username]  
  for(i=0 ; i<activityArray.length ; i=i+1){
            if(activityArray[i].activity === activity){
               activityArray.splice(i, 1)
               
            break
        } 
              
    }
    console.log(activityArray + "checking1")
    console.log(username + "checking2")
    console.log(activity + " checking3")
    activityDatabaseObject[username]=activityArray
    fs.writeFileSync(databasePath, JSON.stringify(activityDatabaseObject))
        res.send("deleted")
}
)

app.post("/ReceiveEditing", function(req , res){
 var username = req.body.username
 var oldActivity = req.body.oldActivity
    var newActivity = req.body.activity
    var date = req.body.date
    var DatabaseFile = fs.readFileSync(databasePath,"utf-8")
    var activityDatabaseObject= JSON.parse(DatabaseFile)
    
  var activityArray2 = activityDatabaseObject[username]  
  console.log(activityArray2 ,  "checking4")
  console.log( activityDatabaseObject[username],"checking5")
  for(i=0 ; i<activityArray2.length ; i=i+1){
            if(activityArray2[i].activity === oldActivity){
               activityArray2[i].activity = newActivity
               activityArray2[i].date = date
            break
        } 
              
    }
    console.log(activityDatabaseObject)
    console.log(activityArray2 , "checking1")
    console.log(username + "checking2")
    console.log(activityDatabaseObject[username])
    activityDatabaseObject[username]=activityArray2
    console.log(oldActivity , "checking6")
    
    fs.writeFileSync(databasePath, JSON.stringify(activityDatabaseObject))
        res.send("edited")
}
)


app.listen(2530, function () {
    console.log("Server has started");
}); 