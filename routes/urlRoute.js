const express = require('express');
const Router = express.Router();
const {handlePostURL,handlegetURL,showHomePage} = require('../controllers/urlController')


Router.post('/api/url',handlePostURL);
Router.get('/:shortUrl',handlegetURL);
Router.get('/',showHomePage);

module.exports = Router;