var express = require('express');
var router = express.Router();
var amazonS3Controller = require('../controllers/amazonS3Controller');

router.get('/', amazonS3Controller.upload);

module.exports = router;