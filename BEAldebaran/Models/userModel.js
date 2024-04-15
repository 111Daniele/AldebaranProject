const mongoose= require("mongoose")
const validator= require("validator")
const {Meteor, meteorSchema} = require("./meteorModel.js")
const bcryptjs = require("bcryptjs")
const crypto = require("crypto")

mongoose.connect("mongodb+srv://admin:KpFX8wRoJZ2VZifc@cluster0.aaihora.mongodb.net/Aldebaran?retryWrites=true&w=majority&appName=Cluster0").then((conn)=> console.log("ok conn"))

console.log("ua")

const userSchema= mongoose.Schema({
    name: {type: String, unique: [true, "Already exists user with same name"]},
    surname: {type: String},
    // email: {type: String, validate: [validator.isEmail, "The String is not a valid email format!"]},
    // observatory: {type: String},
    password: {type: String, required:[true, "Password required!"], minlength: 4, select: false},
    meteors: {type: [meteorSchema]},
    //required: [true, "met req"],,
    registration: {type: Date, default: new Date()},
    role: {type: String, enum: ["pending", "approved", "admin"], default: "pending"},
    passwordChangedDate: Date,
    randomPasswordToken: String,
    randomPasswordExpires: Date

})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcryptjs.hash(this.password, 10)
console.log("criptro")
    next()

})


userSchema.methods.verifyPassword= async function(password){
    const correct = await bcryptjs.compare(password, this.password)
    return correct
}


userSchema.methods.passwordChanged = async function(jwtTimestamp){
    if (this.passwordChangedDate){
        let passwordChangedTimestamp= parseInt(this.passwordChangedDate.getTime() / 1000, 10)
        return passwordChangedTimestamp > jwtTimestamp
    }
    return false
}


userSchema.methods.generateRandomPasswordToken= async function(){
    let randomResetToken= crypto.randomBytes(16).toString("hex")

    this.randomPasswordToken= bcryptjs.createHash("sha256").update(randomResetToken).digest("hex")
    this.randomPasswordExpires= Date.now() + 15 * 60000;
    return randomResetToken
}

const User = mongoose.model("user", userSchema)




// us = create()

async function create() { await User.create({name: "nuovoabc", surname:"aaa", password: "9999999",meteors:[{"id":"a"}]}).then(console.log("aua"))}



module.exports= User