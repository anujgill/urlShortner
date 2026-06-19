const express = require('express');
const Router = express.Router();
const { handlePostURL, handlegetURL, handleDeleteURL } = require('../controllers/urlController');
const { validUser } = require('../middlewares/userAccess');

Router.post('/', validUser, handlePostURL);
Router.delete('/:id', validUser, handleDeleteURL);
Router.get('/:shortUrl', handlegetURL);

module.exports = Router;