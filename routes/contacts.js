var express = require('express');
var router = express.Router();
var contactsController = require('../controllers/contactsController');

router.post('/', contactsController.contactUs);

module.exports = router;