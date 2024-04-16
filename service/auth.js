const jwt = require('jsonwebtoken');
const secretKey = process.env.secretKey;
function setUser(user, res){
    const token = jwt.sign({_id: user._id,username:user.username,email:user.email}, secretKey,{expiresIn : "12h"});
    res.cookie("uid", token,{maxAge:"12h"});
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, secretKey);
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