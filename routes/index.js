var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(request, response, next) {
  response.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;
