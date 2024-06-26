const urlData = require('../models/urlModel')
const randomId = require('random-id');

async function handlePostURL(req,res){
    const fullUrl = req.body.oriurl;
    const id = randomId(8,'aA0');
    // console.log(req.user);
    await urlData.create({
        original_url:fullUrl,
        short_url: id,
        visitCount:0,
        createdBy:req.user._id
    });
    res.redirect("/");
}

async function handlegetURL(req,res){
    const short_url = req.params.shortUrl;
    // console.log(short_url)
    const redURL = await urlData.findOneAndUpdate({short_url},{$inc: { visitCount: 1 }});
    // console.log(redURL)
    return res.redirect(redURL.original_url);
}



module.exports = {
    handlePostURL,
    handlegetURL,
}