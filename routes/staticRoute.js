const express = require('express');
const Router = express.Router();
const {
    showHomePage,
    showSignUp,
    showLogIn,
    showVerifyOtp,
    showForgotPassword,
    showResetPassword
} = require('../controllers/staticController');
const { checkAuth } = require('../middlewares/userAccess');

Router.get('/', checkAuth, showHomePage);
Router.get('/signup', showSignUp);
Router.get('/login', showLogIn);
Router.get('/verify-otp', showVerifyOtp);
Router.get('/forgot-password', showForgotPassword);
Router.get('/reset-password', showResetPassword);

module.exports = Router;