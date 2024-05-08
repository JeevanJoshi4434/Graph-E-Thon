const express = require('express');
const app = express();
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./Middleware/error");
var cors = require('cors');
const path = require('path');
const Routes = require('./Routes/userRoutes'); 

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config({path:".env"})
}
app.use(cors())
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ limit: '35mb', extended: true }));
app.use(cookieParser())
// Route Imports

app.use(`/api/v1`,Routes);

if(process.env.NODE_ENV==="PRODUCTION"){
    app.use(express.static(path.join(__dirname,"../build")));
    
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"../build/index.html"));
    })
}

// Middleware for error
app.use(errorMiddleware);

module.exports = app;