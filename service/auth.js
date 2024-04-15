const sessionIDtoUserMap = new Map();

function setUser(id,user){
    sessionIDtoUserMap.set(id,user);
}

function getUser(id){
    return sessionIDtoUserMap.get(id);
}

function remUser(id){
    sessionIDtoUserMap.delete(id);
}

module.exports = {
    setUser,
    getUser,
    remUser,
}