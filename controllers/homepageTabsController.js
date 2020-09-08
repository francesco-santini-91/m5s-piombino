const HomepageTab = require('../models/homepageTab');
const jwt = require('jsonwebtoken');

exports.getTabs = async function(request, response, next) {
    await HomepageTab
        .find({}, '_id title content')
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            response.json(results);
        });
}

exports.getTab = async function(request, response, next) {
    await HomepageTab
        .findOne({'_id': request.params.tabID})
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

exports.addTab = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else if(decoded.isSuperUser == true) {
            await HomepageTab
                .findOne({'title': request.body.title})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        var newTab = new HomepageTab (
                            {
                                title: request.body.title,
                                content: request.body.content,
                            });
                        await newTab.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({saved: true});
                        });
                    }
                    else {
                        response.json({tabAlreadyExist: true});
                    }
                });
            }
            else {
                response.json({unauthorized: true});
            }   
    });
}

exports.editTab = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true) {
            response.json({unauthorized: true});
        }
        else if(decoded.isSuperUser == true) {
            await HomepageTab
                .findOne({'_id': request.params.tabID})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else {
                        results.title = request.body.title;
                        results.content = request.body.content;
                        await results.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({edited: true});
                        });
                    }
                });
        }
        else {
            response.json({unauthorized: true});
        }
    });
}

exports.deleteTab = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else if(decoded.isSuperUser == true) {
            await HomepageTab
                .findOne({'_id': request.params.tabID})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else {
                        await results.remove(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({deleted: true});
                        });
                    }
                });
        }
        else {
            response.json({unauthorized: true});
        }
    });
}
