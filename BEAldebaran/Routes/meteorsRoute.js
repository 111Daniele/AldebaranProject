const exp= require('express');
const userController = require("./../Controllers/userController.js")


const router= exp.Router();

console.log("qui arrivato");

router.route("/addMeteor").post(userController.addMeteor)

router.route("/users/:id").get(userController.getUser)

router.route("/users").get(userController.getUsers)

router.route("/login").post(userController.handleLogin)

router.route("/signup").post(userController.handleSignup)

router.route("/protect").get(userController.protect)

router.route("/protect2").get(userController.webtok)

router.route("/forgotPassword").post(userController.forgotPassword)

module.exports= router