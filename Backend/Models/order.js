const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type: String,
        require: true
    },
    shopID:{
        type: String,
        require: true
    },
    medicines:{
        type: Array,
        require: true
    },
    total:{
        type: Number,
        require: true
    },
    address:{
        type: String,
        require: true
    },
    status:{
        type: Number,
        require: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    location:{
        latitude:{
            type: Number,
            default: 0.0
        },
        longitude:{
            type: Number,
            default: 0.0
        }
    },
    shopDetails:{
        name:{
            type: String,
            require: true
        },
        address:{
            type: String,
            require: true
        },
        location:{
            latitude:{
                type: Number,
                default: 0.0
            },
            longitude:{
                type: Number,
                default: 0.0
            }
        }
    },
    OTP:{
        type:Number,
        default: Math.floor(100000 + Math.random() * 900000)
    },
    updates:{
        type: Array,
        default: [
            {
                text: "Ordered",
                status: 0,
                time: Date.now()
            }
        ]
    }

},{timestamps:true});

module.exports = mongoose.model("Order", orderSchema);