const express = require('express');
const Router = express.Router();
const {showHomePage,showSignUp,showLogIn} = require('../controllers/staticController')
const validUser = require('../middlewares/userAccess');

Router.get('/',validUser,showHomePage);
Router.get('/signup',showSignUp);
Router.get('/login',showLogIn);

module.exports = Router;