const users = require('../models/userModel');
const {v4 : uuidv4} = require('uuid');
const {setUser,remUser} = require('../service/auth');

async function handleSignUp(req,res){
    const newUser = req.body;
    await users.create(newUser);
    return res.redirect('/login');
}

async function handleLogIn(req,res){
    const {email,password} = req.body;
    const u = await users.findOne({email,password});
    if(u){
        const sessionID = uuidv4();
        setUser(sessionID,u);
        res.cookie("uid",sessionID);
        return res.redirect('/');
    } 
    else return res.redirect('/signup');
}

async function handleLogOut(req,res){
    remUser(res.cookie.uid);
    res.clearCookie("uid");
    return res.redirect('/login');
}

module.exports = {
    handleSignUp,
    handleLogIn,
    handleLogOut,
}