const express = require('express');
const Router = express.Router();
const {handlePostURL,handlegetURL} = require('../controllers/urlController');
const validUser = require('../middlewares/userAccess')

Router.post('/',validUser,handlePostURL);
Router.get('/:shortUrl',handlegetURL);

module.exports = Router;