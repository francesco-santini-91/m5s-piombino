var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController');

const { body, validationResult } = require('express-validator');

router.post('/', [
    body('usernameOrEmail').trim().escape(),
    body('password').escape()
], loginController.login);

router.get('/confirm/:username', loginController.confirmRegistration);

router.post('/auth', loginController.verifyAuthentication);

module.exports = router;