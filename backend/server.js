const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
app.use(express.json())  

app.get('/',function(req,res){
    res.sendFile('C:/Users/balag/OneDrive/Desktop/Pranessh coding/all fullstack projects/Personal calender/frontend/index.html')
})

// app.post("/ourFirstPost", function(req, res){
//     var obj = req.body
//     console.log(obj)
// })   

app.listen(2530, function () {
    console.log("Server has started");
});