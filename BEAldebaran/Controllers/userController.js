const mongoose= require("mongoose")
const User= require("./../Models/userModel.js")
const {Meteor}= require("./../Models/meteorModel.js")
const jwt = require("jsonwebtoken")
const asyncErrorHandler = require("./../Utils/asyncErrorHandler.js")
const CustomError = require("../Utils/CustomError.js")

generateToken = id =>  jwt.sign({id}, process.env.SECR_STR, {expiresIn: +process.env.LOGIN_EXPIRES})




exports.handleLogin = async (req, res, next)=>{
    console.log("LOGIN", process.env.LOGIN_EXPIRES)
    const {name, password} = req.body
    console.log("body", req.body, "name, password", name, password)
    //Don't check if email and password exist, because are required in front-end
    const user= await User.findOne({name}).select("+password") //Use findOne instead find to avoid getting List User[]
    if (!user) next(new CustomError("Username not exists!", 400))
    const correct_password = await user.verifyPassword(password)
    if (!correct_password){
        let pass_error= new CustomError("Password incorrect!", 400)
        return next(pass_error)
    }

    const token= generateToken(user._id)

    console.log("tojken login", token)
    console.log("utente", user)
    res.status(200).json({status: "success", token, data: {user}, expires: +process.env.LOGIN_EXPIRES})

} 

exports.handleSignup= asyncErrorHandler(async (req, res, next) => {
    console.log("inzizio")
    console.log("body", req.body);
  
    console.log("REGISTRAZIONE")
 
    const user= await User.create(req.body);
    console.log("process.env.SECRET_STR)" );
    console.log(process.env.SECR_STR);
    const token= generateToken(user._id)
    console.log("token", token)
    console.log("utente", user)
    return res.status(201).json({status: "success", token, data: {user}})

})

exports.webtok=  asyncErrorHandler (async (req, res, next) => {

    console.log(jwt.sign({id:1}, process.env.SECR_STR))


})


exports.protect= asyncErrorHandler (async (req, res, next) => {

    let token = req.headers.authorization;

    console.log("token", token)
    if (!token || !token.startsWith("Bearer")) next( new CustomError("Token not exist or Token not valid", 401)); //Verify that Token Exist
    token= token.split(" ")[1];
    let decodedToken= jwt.verify(token, process.env.SECR_STR)  //Verify that token is Valid
    let user= await User.findById(decodedToken.id)
    if (!user){next(new CustomError("The user has been removed", 401))} //Verify user still exists
    let isChanged= await user.passwordChanged(decodedToken.iat)
    if (isChanged) next(new CustomError("The password has been changed", 401)) //Verify doesn't update password

    req.user= user;
    next()


})


exports.getUser = asyncErrorHandler (async (req, res, next) => {
        // const id= +req.params.id
        const id= req.params.id
        console.log("id£m ", id)
      const user = await User.find({name: id})
      if(user) console.log("trovato user ", user)
      else{
        console.log("NON trovato user ", id)
    }
      res.status(201).json({status: "success",data: user})
})





exports.getUsers = asyncErrorHandler (async (req, res, next) => {

    // GETALUSERS
})


exports.addMeteor =  asyncErrorHandler (async (req, res, next) => {
    console.log("iniz")
    // const id= +req.body.id
    const idName= req.body.idName
    let meteor= req.body.meteor
    meteor["author"]= idName
    console.log("idName ", idName)
    console.log("meteors", meteor)
      const user = await User.findOne({name: idName})
      console.log("tutto ok", user, "met", user.meteors, user.surname)
    
    user.meteors.push(meteor)
    const details= await user.save()
    let meteorTransform= await Meteor.create(meteor)
  
    const details2= await meteorTransform.save()
    console.log("nuova meteora", meteorTransform)
    console.log("nuovo user ", user)
      res.status(200).json({status: "success",data: user})
})


exports.limit = role => asyncErrorHandler (async (req, res, next) => {
    if (req.user.role!== role) next(new CustomError("Don't have specified role!", 403))
    next()
})



exports.forgotPassword = asyncErrorHandler( async (req, res, next)=>{
    let user= await User.findOne({email: req.body.email})
    if (!user) next(new CustomError("Doesn't exists user with this email", 404))
    let resetPasswordToken = user.generateRandomPasswordToken();
await user.save({validateBeforeSave: true})
})


exports.usersNotApproved= asyncErrorHandler( async (req, res, next)=>{
    
    let users= await User.find({role:"pending"})
    res.status(200).json({status: "success", data: users})
})

exports.approveUser= asyncErrorHandler( async (req, res, next)=>{
    let id= req.body.id
    let user= await User.findOne({name: id})
    user.role= "approved"
    
    await user.save()
})


exports.admin = asyncErrorHandler( async (req, res, next)=>{
    
})


