const { getUser } = require("../service/auth");

function validUser(req,res,next){
    const token = req.cookies?.uid;
    const user = getUser(token);
    if(!user) return res.render('login');
    req.user = user;
    next();
}

module.exports = validUser;