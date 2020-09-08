const User = require('../models/user');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');

exports.getUsersList = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else if(decoded.isSuperUser == true || decoded.isAdmin == true) {
            await User
                .find({}, 'username avatar name surname dateOfBirth email registrationDate isConfirmed isAdmin isSuperUser isBanned')
                .sort({'isSuperUser': -1, 'isAdmin': -1, 'isConfirmed': -1, 'isBanned': -1, 'username': 1 })
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
        else {
            await User
                .find({}, 'username avatar name surname dateOfBirth')
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
    });
}

exports.getUserDetails = async function(request, response, next) {
    await User
        .findOne({'_id': request.params.userID}, 'username avatar name surname dateOfBirth')
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

exports.getUserDetails__POST = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true) {
            response.json({unauthorized: true});
        }
        else {
            await User
                .findOne({'_id': request.params.userID}, 'username avatar name surname dateOfBirth email registrationDate isConfirmed isAdmin isSuperUser isBanned')
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
    });
    
}

exports.getPostsByUser = async function(request, response, next) {
    await Post
        .find({'author': request.params.username})
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

exports.createNewUser = async function(request, response, next) {
    await User
        .findOne({ $or: [{'username': request.body.username}, {'email': request.body.email}]})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var avatar;
                if(request.file == undefined) {
                    avatar = 'default.jpg';
                }
                else {
                    avatar = request.file.filename+'.jpg';
                }
                var newUser = new User (
                {
                    username: request.body.username,
                    password: request.body.password,
                    avatar: avatar,
                    name: request.body.name,
                    surname: request.body.surname,
                    dateOfBirth: new Date(request.body.dateOfBirth),
                    email: request.body.email,
                    registrationDate: Date.now(),
                    isConfirmed: false,
                    isAdmin: false,
                    isSuperUser: false,
                    isBanned: false
                });
                await newUser.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    jwt.sign(
                        {
                            userID: newUser._id,
                            username: newUser.username,
                            isConfirmed: newUser.isConfirmed,
                            isAdmin: newUser.isAdmin,
                            isSuperUser: newUser.isSuperUser,
                            isBanned: newUser.isBanned
                        },
                        process.env.SECRET_KEY,
                        {expiresIn: process.env.JWT_EXPIRATION_CONFIRM},
                        async function(errors, token) {
                            if(errors) {
                                return next(errors);
                            }
                            let transporter = nodemailer.createTransport({
                                host: process.env.EMAIL_HOST,
                                port: process.env.EMAIL_PORT,
                                auth: {
                                    user: process.env.EMAIL,
                                    pass: process.env.EMAILPWD
                                }
                            });
                            let link=process.env.PUBLIC_URL+'/confirm/'+request.body.username+'?t='+token;
                            await transporter.sendMail({
                                from: 'Movimento 5 Stelle Piombino',
                                to: request.body.email,
                                subject: 'Conferma registrazione',
                                html: '<a href="'+link+'">Clicca qui</a>'
                            });
                        }
                    );
                    response.json({saved: true});
                });
            }
            else {
                response.json({userAlreadyExist: true});
            }
        });
}

exports.resendEmail = async function(request, response, next) {
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true) {
            response.json({unauthorized: true});
        }
        else if(decoded.isConfirmed == false) {
            await User
                .findOne({'_id': decoded.userID}, '_id username email isConfirmed isAdmin isSuperUser isBanned')
                .exec(function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else {
                        jwt.sign(
                            {
                                userID: results._id,
                                username: results.username,
                                isConfirmed: results.isConfirmed,
                                isAdmin: results.isAdmin,
                                isSuperUser: results.isSuperUser,
                                isBanned: results.isBanned
                            },
                            process.env.SECRET_KEY,
                            {expiresIn: process.env.JWT_EXPIRATION_CONFIRM},
                            async function(errors, token) {
                                if(errors) {
                                    return next(errors);
                                }
                                let transporter = nodemailer.createTransport({
                                    host: process.env.EMAIL_HOST,
                                    port: process.env.EMAIL_PORT,
                                    auth: {
                                        user: process.env.EMAIL,
                                        pass: process.env.EMAILPWD
                                    }
                                });
                                let link=process.env.PUBLIC_URL+'/confirm/'+results.username+'?t='+token;
                                await transporter.sendMail({
                                    from: 'Movimento 5 Stelle Piombino',
                                    to: results.email,
                                    subject: 'Conferma registrazione',
                                    html: '<a href="'+link+'">Clicca qui</a>'
                                });
                            }
                        );
                        response.json({sended: true});
                    }
                });
        }
    });
}

exports.resetPassword = async function(request, response, next) {
    await User
        .findOne({'email': request.body.email})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({noResults: true});
            }
            else {
                jwt.sign(
                    {
                        userID: results._id,
                        username: results.username,
                        isConfirmed: results.isConfirmed,
                        isAdmin: results.isAdmin,
                        isSuperUser: results.isSuperUser,
                        isBanned: results.isBanned
                    },
                    process.env.SECRET_KEY,
                    {expiresIn: process.env.JWT_EXPIRATION_CONFIRM},
                    async function(errors, token) {
                        if(errors) {
                            return next(errors);
                        }
                        let transporter = nodemailer.createTransport({
                            host: process.env.EMAIL_HOST,
                            port: process.env.EMAIL_PORT,
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.EMAILPWD
                            }
                        });
                        let link=process.env.PUBLIC_URL+'/restorePassword/'+results.username+'?t='+token;
                        await transporter.sendMail({
                            from: 'Movimento 5 Stelle Piombino',
                            to: results.email,
                            subject: 'Reset password',
                            html: '<a href="'+link+'">Clicca qui</a>'
                        });
                    }
                );
                response.json({sended: true});
            }
        });
}

exports.restorePassword = async function(request, response, next) {
    await User
        .findOne({'username': request.body.username})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({userNotFound: true});
            }
            else {
                await jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results._id == decoded.userID) {
                        results.password = request.body.password;
                        await results.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({saved: true});
                        });
                    }
                    else {
                        response.json({unauthorized: true});
                    }
                });
            }
        });
}

exports.updateAvatar = async function(request, response, next) {
    await User
        .findOne({'_id': request.params.userID})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({userNotFound: true});
            }
            else {
                await jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
                    if(errors) {
                        return next(errors);
                    }
                    results.avatar = request.body.avatar;
                    await results.save(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        response.json({updated: true});
                    })
                });
            }
        });
}

exports.editUser = async function(request, response, next) {
    await User
        .findOne({'_id': request.params.userID})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({userNotFound: true});
            }
            else {
                await jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
                    if(errors) {
                        return next(errors);
                    }
                    var avatar;
                    if(request.file == undefined) {
                        avatar = results.avatar;
                    }
                    else {
                        avatar = results.file.filename+'.jpg';
                    }
                    if(decoded.username == results.username) {
                        if(request.body.oldPassword == undefined) {
                            results.password = results.password;
                        }
                        else {
                            bcryptjs.compare(request.body.oldPassword, results.password, async function(errors, comparison) {
                                if(errors) {
                                    return next(errors);
                                }
                                if(comparison) {
                                    results.password = request.body.newPassword;    //  <---
                                    results.avatar = avatar;                        //  <---
                                    results.name = request.body.name;               //  <---
                                    results.surname = request.body.surname;         //  <---
                                    results.dateOfBirth = request.body.dateOfBirth;
                                    await results.save(function(errors) {
                                        if(errors) {
                                            return next(errors);
                                        }
                                        response.json({edited: true});
                                    });
                                }
                                else {
                                    results.password = results.password;
                                    response.json({wrongPassword: true});
                                }
                            });
                        }
                        
                    }
                    else if(decoded.isSuperUser == true) {
                        results.email = request.body.email; 
                        results.isConfirmed = request.body.isConfirmed; //  <---
                        results.isAdmin = request.body.isAdmin;         //  <---
                        results.isSuperUser = request.body.isSuperUser; //  <---
                        results.isBanned = request.body.isBanned;       //  <---
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

exports.deleteUser = async function(request, response, next) {
    await User
        .findOne({'_id': request.params.userID})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({userNotFound: true});
            }
            else {
                await jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
                    if(errors) {
                        return next(errors);
                    }
                    if(decoded.username == results.username || decoded.isSuperUser == true) {
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