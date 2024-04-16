const users = require('../models/userModel');
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
        setUser(u,res);
        // console.log(req.user);
        return res.redirect('/');
    } 
    else return res.redirect('/signup');
}

async function handleLogOut(req,res){
    res.clearCookie("uid");
    return res.redirect('/login');
}

module.exports = {
    handleSignUp,
    handleLogIn,
    handleLogOut,
}