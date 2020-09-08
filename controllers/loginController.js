const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async function(request, response, next) {
    await User 
        .findOne({ $or: [{'username': request.body.usernameOrEmail}, {'email': request.body.usernameOrEmail}]})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({userNotFound: true});
            }
            else {
                bcryptjs.compare(request.body.password, results.password, async function(errors, comparison) {
                    if(errors) {
                        return next(errors);
                    }
                    if(comparison) {
                        await jwt.sign(
                            {
                                userID: results._id,
                                username: results.username,
                                avatar: results.avatar,
                                isConfirmed: results.isConfirmed,
                                isAdmin: results.isAdmin,
                                isSuperUser: results.isSuperUser,
                                isBanned: results.isBanned
                            },
                            process.env.SECRET_KEY,
                            {expiresIn: process.env.JWT_EXPIRATION},
                            function(errors, token) {
                                if(errors) {
                                    return next(errors);
                                }
                                response.json({token});
                            }
                        );
                    }
                    else {
                        response.json({wrongPassword: true});
                    }
                });
            }
        });

}

exports.confirmRegistration = async function(request, response, next) {
    await User
        .findOne({'username': request.params.username})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({userNotFound: true});
            }
            else {
                jwt.verify(request.query.t, process.env.SECRET_KEY, async function(errors, decoded) {
                    if(errors) {
                        return next(errors);
                    }
                    if(decoded.isConfirmed == true) {
                        response.json({alreadyConfirmed: true});
                    }
                    else {
                        results.isConfirmed = true;
                        await results.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({confirmed: true});
                        });
                    }
                });
            }
        });
}

exports.verifyAuthentication = function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        response.json({authorized: true, decoded: decoded});
    });
}