const express = require('express');
const Router = express.Router();
const {handleSignUp,handleLogIn} = require('../controllers/userController');

Router.post("/signup",handleSignUp);
Router.post("/login",handleLogIn);

module.exports = Router;