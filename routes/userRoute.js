const express = require('express');
const Router = express.Router();
const {handleSignUp,handleLogIn,handleLogOut} = require('../controllers/userController');

Router.post("/signup",handleSignUp);
Router.post("/login",handleLogIn);
Router.get("/logout",handleLogOut);


module.exports = Router;