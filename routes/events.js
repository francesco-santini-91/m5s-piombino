var express = require('express');
var router = express.Router();
var eventsController = require('../controllers/eventsController');

router.get('/', eventsController.getFutureEventsList);

router.get('/numberOfFutureEvents', eventsController.getNumberOfFutureEvents)

router.get('/allEvents', eventsController.getAllEventsList);

router.get('/numberOfAllEvents', eventsController.getNumberOfAllEvents);

router.post('/newEvent', eventsController.createEvent);

router.get('/:eventID', eventsController.getEventDetail);

router.post('/:eventID', eventsController.verifyParticipation);

router.post('/:eventID/participate', eventsController.participateToEvent);

router.put('/:eventID', eventsController.editEvent);

router.patch('/:eventID', eventsController.deleteEvent);

module.exports = router;