const urlData = require('../models/urlModel');
// const { getUser } = require('../service/auth');

async function showHomePage(req,res){
    // console.log(req.user)
    const allUrls = await urlData.find({createdBy:req.user?._id});
    const baseUrl = process.env.base_URL;
    //  || (req.protocol + '://' + req.get('host'));
    res.render('index',{
        urlData : allUrls,
        baseUrl : baseUrl
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