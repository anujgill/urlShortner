const { getUser } = require("../service/auth");

function validUser(req,res,next){
    const id = req.cookies?.uid;
    const user = getUser(id);
    if(!user) return res.render('login');
    req.user = user;
    console.log(req.user)
    next();
}

module.exports = validUser;