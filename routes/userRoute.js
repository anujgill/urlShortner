const express = require('express');
const Router = express.Router();
const {
    handleSignUp,
    handleLogIn,
    handleLogOut,
    handleVerifyOtp,
    handleResendOtp,
    handleForgotPassword,
    handleResetPassword
} = require('../controllers/userController');

Router.post("/signup", handleSignUp);
Router.post("/login", handleLogIn);
Router.get("/logout", handleLogOut);
Router.post("/verify-otp", handleVerifyOtp);
Router.get("/resend-otp", handleResendOtp);
Router.post("/forgot-password", handleForgotPassword);
Router.post("/reset-password", handleResetPassword);

module.exports = Router;