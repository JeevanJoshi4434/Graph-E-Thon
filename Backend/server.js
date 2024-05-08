const app = require('./app');
const connectDatabase = require("./config/database");
// Uncought Exception handeler
process.on("uncaughtException",(err)=>{
    // console.log(`Error: ${err.message}`)
    // console.log(`Shutting down the server due to Uncought Exception`)
    process.exit(1);
})

// config 
if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config({path:".env"})
}
// connect to database
console.log("Connecting");
connectDatabase();




const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is listening at http://localhost:${process.env.PORT}`)
});
