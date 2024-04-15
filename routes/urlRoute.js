const express = require('express');
const Router = express.Router();
const {handlePostURL,handlegetURL} = require('../controllers/urlController');


Router.post('/',handlePostURL);
Router.get('/:shortUrl',handlegetURL);

module.exports = Router;