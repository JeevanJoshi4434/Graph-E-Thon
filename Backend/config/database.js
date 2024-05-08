const mongoose = require('mongoose');


const connectdatabase = ()=>{
    console.log({URI:process.env.DB_URI});
    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // useCreateIndex:true,
    }).then((data)=>{
        console.log(`Mongodb connected at: ${process.env.DB_URI}`);
    })
    
};

module.exports = connectdatabase