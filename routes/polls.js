var express = require('express');
var router = express.Router();
var pollsController = require('../controllers/pollsController');

router.get('/', pollsController.getActivePolls);

router.get('/numberOfActivePolls', pollsController.getNumberOfActivePolls);

router.get('/allPolls', pollsController.getAllPolls);

router.get('/numberOfAllPolls', pollsController.getNumberOfAllPolls);

router.get('/:pollID', pollsController.getPollDetail);

router.post('/newPoll', pollsController.createPoll);

router.post('/:pollID', pollsController.verifyVote);

router.put('/:pollID', pollsController.editPoll);

router.post('/:pollID/vote', pollsController.vote);

router.patch('/:pollID', pollsController.deletePoll);

module.exports = router;