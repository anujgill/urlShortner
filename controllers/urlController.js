const urlData = require('../models/urlModel')
const randomId = require('random-id');
require('dotenv').config();

async function handlePostURL(req,res){
    const fullUrl = req.body.oriurl;
    const id = randomId(8,'aA0');
    await urlData.create({
        original_url:fullUrl,
        short_url: id,
        visitCount:0
    });
    res.redirect("/");
}

async function handlegetURL(req,res){
    const short_url = req.params.shortUrl;
    console.log(short_url)
    const redURL = await urlData.findOneAndUpdate({short_url},{$inc: { visitCount: 1 }});
    console.log(redURL)
    return res.redirect(redURL.original_url);
}

async function showHomePage(req,res){
    const allUrls = await urlData.find({});
    const baseUrl = process.env.base_URL || (req.protocol + '://' + req.get('host'));
    const fullUrl = baseUrl + req.originalUrl;
    res.render('index',{
        urlData : allUrls,
        fullUrl : fullUrl
    });
}


module.exports = {
    handlePostURL,
    handlegetURL,
    showHomePage,
}