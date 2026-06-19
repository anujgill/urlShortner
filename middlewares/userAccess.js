const { getUser } = require("../service/auth");

function validUser(req,res,next){
    const token = req.cookies?.uid;
    const user = getUser(token);
    if(!user) return res.redirect('/login');
    req.user = user;
    next();
}

function checkAuth(req,res,next){
    const token = req.cookies?.uid;
    const user = getUser(token);
    req.user = user || null;
    next();
}

module.exports = {
    validUser,
    checkAuth
};