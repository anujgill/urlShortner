const users = require('../models/userModel');
const {v4 : uuidv4} = require('uuid');
const {setUser} = require('../service/auth');

async function handleSignUp(req,res){
    const newUser = req.body;
    await users.create(newUser);
    return res.redirect('/');
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

module.exports = {
    handleSignUp,
    handleLogIn,
}