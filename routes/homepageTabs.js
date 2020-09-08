var express = require('express');
var router = express.Router();
var homepageTabsController = require('../controllers/homepageTabsController');

router.get('/', homepageTabsController.getTabs);

router.get('/:tabID', homepageTabsController.getTab);

router.post('/addTab', homepageTabsController.addTab);

router.put('/:tabID', homepageTabsController.editTab);

router.patch('/:tabID', homepageTabsController.deleteTab);

module.exports = router;