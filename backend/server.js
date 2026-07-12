const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require('fs')
const databasePath = '../database/activityData.json'

const app = express()
app.use(express.json())  

app.get('/',function(req,res){
    res.sendFile('C:/Users/mihir/OneDrive/Desktop/Classes/Pranessh Web Dev Classes/Personal Calendar/frontend/index.html')
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

    for( i in databaseObj ){
        console.log(i)
        console.log(databaseObj[i])
    }
    //Pranessh pls do the following logic-
    // Try to find the username posted by the frontend in the database file and if we get the username in the file we just add the new activity inside the array of the username, but if we dont find the username then we just need to create a new key/property and add it inside the database file
})   

app.listen(2530, function () {
    console.log("Server has started");
});