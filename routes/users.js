var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');

const { body, validationResult } = require('express-validator');

/* GET users listing. */
router.post('/', usersController.getUsersList);

router.post('/register', [
    body('username').trim().escape(),   // Sanificazione input form
    body('name').trim(). escape(),
    body('surname').trim().escape(),
    body('email').trim().escape(),
    body('password').escape()
], usersController.createNewUser);

router.post('/resend', usersController.resendEmail);

router.post('/resetPassword', usersController.resetPassword);

router.post('/restorePassword', [
    body('password').escape()
], usersController.restorePassword);

router.get('/:userID', usersController.getUserDetails);

router.post('/:userID', usersController.getUserDetails__POST);

router.get('/:username/posts', usersController.getPostsByUser);

router.put('/:userID', usersController.editUser);

router.put('/:userID/upload', usersController.updateAvatar);

router.patch('/:userID', usersController.deleteUser);


module.exports = router;
