const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [60, "Name cannot exceed 30 Characters"],
        minLength: [1, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "please Enter your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false
    },
    isMedical: {
        type: Boolean,
        default: false
    },
    ShopName:{
        type: String,
        default: "My Shop"
    },
    medicines:{
        type: Array,
        default: []
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
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// JWT Token

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Forget Password && Generating Reset Token

userSchema.methods.getResetPasswordToken = function () {

    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and add to userSchema

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hax");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);