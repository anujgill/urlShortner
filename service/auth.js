const jwt = require('jsonwebtoken');
function setUser(user, res){
    const token = jwt.sign({_id: user._id,username:user.username,email:user.email}, process.env.SECRET_KEY,{expiresIn : "12h"});
    const maxAgeMs = 12 * 60 * 60 * 1000;
    res.cookie("uid", token,{maxAge: maxAgeMs});
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return null;
        }
        throw error;
    }
}

module.exports = {
    setUser,
    getUser,
}
