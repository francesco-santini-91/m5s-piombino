const Event = require('../models/event');
const jwt = require('jsonwebtoken');

var eventsPerPage = 10;

exports.getFutureEventsList = async function(request, response, next) {
    await Event
        .find({'data': {$gt: Date.now()}}, 'id title author image content data location participants')
        .sort({'data': 1})
        .skip((request.query.page - 1) * eventsPerPage)
        .limit(eventsPerPage)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({noResults: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.getNumberOfFutureEvents = async function(request, response, next) {
    await Event
        .countDocuments({'data': {$gt: Date.now()}})
        .exec(function(errors, count) {
            if(errors) {
                return next(errors);
            }
            response.json({totalFutureEvents: count});
        });
}

exports.getAllEventsList = async function(request, response, next) {
    if(request.query.page == 999) {
        eventsPerPage = 3;
        request.query.page = 1;
    }
    else {
        eventsPerPage = 5;
    }
    await Event
        .find({}, 'id title author image content data location participants')
        .sort({'data': -1})
        .skip((request.query.page - 1) * eventsPerPage)
        .limit(eventsPerPage)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({noResults: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.getNumberOfAllEvents = async function(request, response, next) {
    await Event
        .countDocuments({})
        .exec(function(errors, count) {
            if(errors) {
                return next(errors);
            }
            response.json({totalEvents: count});
        });
}

exports.getEventDetail = async function(request, response, next) {
    await Event
        .findOne({'_id': request.params.eventID})
        .populate('participants')
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({noResults: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.createEvent = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        if(decoded.isAdmin == true) {
            await Event
                .findOne({'title': request.body.title})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null || (results.data != request.body.data)) {
                        var newEvent = new Event(
                            {
                                id: request.body.id,
                                title: request.body.title,
                                author: decoded.username,
                                image: request.body.image,
                                content: request.body.content,
                                data: request.body.data,
                                location: request.body.location
                            }
                        );
                        await newEvent.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({created: true});
                        });
                    }
                    else {
                        response.json({eventAlreadyExist: true});
                    }
                });
        }
        else {
            response.json({unauthorized: true});
        }
    });
    
}

exports.editEvent = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Event
                .findOne({'_id': request.params.eventID})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else if(decoded.username == results.author || decoded.isSuperUser == true) {
                        results.title = results.title;
                        if(request.file == undefined) {
                            results.image = results.image;
                        }
                        else {
                            results.image = request.file.filename+'.jpg';
                        }
                        results.content = request.body.content;
                        results.data = request.body.data;
                        results.location = request.body.location;
                        await results.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({edited: true});
                        });
                    }
                    else {
                        response.json({unauthorized: true});
                    }
                });
        }
    });
    
}

exports.deleteEvent = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Event
                .findOne({'_id': request.params.eventID})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else if(decoded.username == results.author || decoded.isSuperUser == true) {
                        await results.deleteOne(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({deleted: true});
                        });
                    }
                    else {
                        response.json({unauthorized: true});
                    }
                });
        }
    });
    
}

exports.verifyParticipation = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Event
                .findOne({ $and: [{'_id': request.params.eventID}, {participants: decoded.userID}]})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({participation: false});
                    }
                    else {
                        response.json({participation: true});
                    }
                });
        }
    });
}

exports.participateToEvent = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Event
                .findOne({'_id': request.params.eventID})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else {
                        results.participants.push(decoded.userID);
                        await results.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({participate: true});
                        });
                    }
                });
        }
    });
    
}