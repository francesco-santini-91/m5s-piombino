const Poll = require('../models/poll');
const jwt = require('jsonwebtoken');

var pollsPerPage = 5

exports.getActivePolls = async function(request, response, next) {
    await Poll
        .find({'isActive': true}, 'id title author data isActive voters')
        .sort({'data': -1})
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

exports.getNumberOfActivePolls = async function(request, response, next) {
    await Poll
        .countDocuments({'isActive': true})
        .exec(function(errors, count) {
            if(errors) {
                return next(errors);
            }
            response.json({totalActivePolls: count});
        });
}

exports.getAllPolls = async function(request, response, next) {
    if(request.query.page == 999) {
        pollsPerPage = 3;
        request.query.page = 1;
    }
    else {
        pollsPerPage = 5;
    }
    await Poll
        .find({}, 'id title author data content isActive voters')
        .sort({'data': -1})
        .skip((request.query.page - 1) * pollsPerPage)
        .limit(pollsPerPage)
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

exports.getNumberOfAllPolls = async function(request, response, next) {
    await Poll
        .countDocuments({})
        .exec(function(errors, count) {
            if(errors) {
                return next(errors);
            }
            response.json({totalPolls: count});
        });
}

exports.getPollDetail = async function(request, response, next) {
    await Poll
        .findOne({'_id': request.params.pollID})
        .populate('voters')
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

exports.createPoll = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else if(decoded.isAdmin == true) {
            var newPoll = new Poll(
                {
                    title: request.body.title,
                    author: decoded.username,
                    data: Date.now(),
                    content: request.body.content,
                    isActive: request.body.isActive,
                    voters: [],
                    options: request.body.options
                }
            );
            await newPoll.save(function(errors) {
                if(errors) {
                    return next(errors);
                }
                response.json({created: true});
            });
        }
        else {
            response.json({unauthorized: true});
        }
    });
}

exports.verifyVote = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Poll
                .findOne({ $and: [{'_id': request.params.pollID}, {voters: decoded.userID}]})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({alreadyVoted: false});
                    }
                    else {
                        response.json({alreadyVoted: true});
                    }
                });
        }
    });
}

exports.vote = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Poll
                .findOne({'_id': request.params.pollID})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else {
                        let options = results.options;
                        options[request.body.optionID].votes++;
                        results.options = options;
                        results.markModified('options');
                        results.voters.push(decoded.userID);
                        await results.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({voted: true});
                        });
                    }
                });
        }
    });
}

exports.editPoll = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Poll
                .findOne({'_id': request.params.pollID})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else if(decoded.username == results.author || decoded.isSuperUser == true) {
                        results.content = request.body.content;
                        results.isActive = request.body.isActive;
                        results.save(function(errors) {
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

exports.deletePoll = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Poll
                .findOne({'_id': request.params.pollID})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else if(decoded.username == results.author || decoded.isSuperUser == true) {
                        results.remove(function(errors) {
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