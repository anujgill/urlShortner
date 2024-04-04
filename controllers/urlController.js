const urlData = require('../models/urlModel')
const randomId = require('random-id');

async function handlePostURL(req,res){
    const fullUrl = req.body.original_url;
    const id = randomId(8,'aA0');
    await urlData.create({
        original_url:fullUrl,
        short_url:id,
        visitCount:0
    });
    return res.json({msg:"Posted Successfully"})
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
    res.render('index',{
        urlData : allUrls
    });
}


module.exports = {
    handlePostURL,
    handlegetURL,
    showHomePage,
}