const urlData = require('../models/urlModel');
const { getUser } = require('../service/auth');

async function showHomePage(req,res){
    const allUrls = await urlData.find({createdBy:req.user?._id});
    const baseUrl = process.env.base_URL || (req.protocol + '://' + req.get('host'));
    const fullUrl = baseUrl + req.originalUrl;
    res.render('index',{
        urlData : allUrls,
        fullUrl : fullUrl
    });
}

function showSignUp(req,res){
    res.render('signup');
}

function showLogIn(req,res){
    res.render('login');
}

module.exports = {
    showHomePage,
    showSignUp,
    showLogIn,
}