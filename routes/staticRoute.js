const express = require('express');
const Router = express.Router();
const {showHomePage,showSignUp,showLogIn} = require('../controllers/staticController')

Router.get('/',showHomePage);
Router.get('/signup',showSignUp);
Router.get('/login',showLogIn);

module.exports = Router;