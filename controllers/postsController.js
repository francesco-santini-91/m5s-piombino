const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

var postsPerPage = 5;

exports.getPostsList = async function(request, response, next) {
    /*
     *  La funzione invia al client una lista di comunicati: se la pagina richiesta nell'URL è '999' significa che
     *  i cominicati saranno visualizzati nella homepage del sito, e verranno inviati gli ultimi 3 pubblicati.
     *  Se la pagina richiesta è una qualsiasi altra, verranno inviati 5 comunicati, scartando quelli delle pagine precedenti.
     */
    if(request.query.page == 999) {
        postsPerPage = 3;
        request.query.page = 1;
    }
    else {
        postsPerPage = 5;
    }
    await Post
        .find({}, 'id title urlTitle subtitle content image author data likes comments')
        .sort({'data': -1})
        .skip((request.query.page - 1) * postsPerPage)
        .limit(postsPerPage)
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

exports.getNumberOfTotalPosts = async function(request, response, next) {
    /*
     *  Per consentire la creazione dei link di PAGINATION, il server comunica il totale dei comunicati presenti nel Database.
     */
    await Post
        .countDocuments({})
        .exec(function(errors, count) {
            if(errors) {
                return next(errors);
            }
            response.json({totalPosts: count});
        });
}

exports.getPostDetail = async function(request, response, next) {
    /*
     *  Viene restituito il comunicato richiesto tramite URL.
     */
    await Post
        .findOne({'urlTitle': request.params.urlTitle})
        .populate('comments')
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

exports.createPost = async function(request, response, next) {
    /*
     *  Viene creato un nuovo comunicato, solo se chi lo crea è un utente ADMIN.
     *  Prima del salvataggio, viene creato l'url, modificando il titolo scelto dall'utente (rimpiazzando spazi e caratteri speciali).
     */
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else if(decoded.isAdmin == true) {
            await Post
                .findOne({'title': request.body.title})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        var newPost = new Post (
                            {
                                id: request.body.id,
                                title: request.body.title,
                                urlTitle: request.body.title.replace(/ |\/|\?|\=/g, '-'),
                                subtitle: request.body.subtitle,
                                content: request.body.content,
                                image: request.body.image,
                                author: decoded.username,
                                data: Date.now(),
                                likes: [],
                                comments: []
                            });
                        await newPost.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            response.json({created: true});
                        });
                    }
                    else {
                        response.json({postAlreadyExist: true});
                    }
                });
            }
            else {
                response.json({unauthorized: true});
            }   
    });
    
}

exports.editPost = async function(request, response, next) {
    /*
     *  La modifica del comunicato avviene esclusivamente da parte dell'utente che lo ha pubblicato o da un utente SUPER USER.
     */
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true) {
            response.json({unauthorized: true});
        }
        else {
            await Post
                .findOne({'urlTitle': request.params.urlTitle})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else if(decoded.username == results.author || decoded.isSuperUser == true) {
                        results.id = results.id;
                        results.content = request.body.content;
                        if(request.file == undefined) {
                            results.image = results.image;
                        }
                        else {
                            results.image = request.file.filename+'.jpg';
                        }
                        results.author = results.author;
                        results.data = results.data;
                        results.likes = results.likes;
                        results.comments = results.comments;
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

exports.verifyLikeToPost = async function(request, response, next) {
    /*
     *  Verifica se l'utente autenticato ha già cliccato il like al comunicato, verificando se l'ID UTENTE è
     *  presente nell'array dei likes relativi al comunicato.
     */
    await Post
        .findOne({ $and: [{'urlTitle': request.params.urlTitle}, {likes: request.body.userID}]})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({liked: false});
            }
            else {
                response.json({liked: true});
            }
        });
}

exports.likeToPost = async function(request, response, next) {
    /*
     *  L' ID UTENTE viene salvato nell' array dei likes del comunicato.
     */
    await Post
        .findOne({'urlTitle': request.params.urlTitle})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({noResults: true});
            }
            else {
                results.likes.push(request.body.userID);
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({liked: true});
                });
            }
        });
}

exports.verifyLikeToComment = async function(request, response, next) {
    /*
     *  Stessa verifica dei like ai post, ma relativa ai commenti.
     */
    await Comment
        .findOne({ $and: [{'_id': request.params.commentID}, {likes: request.body.userID}]})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({liked: false});
            }
            else {
                response.json({liked: true});
            }
        });
}

exports.likeToComment = async function(request, response, next) {
    await Comment
        .findById(request.params.commentID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({noResults: true});
            }
            else {
                results.likes.push(request.body.userID);
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({liked: true})
                });
            }
        });
}

exports.commentToPost = async function(request, response, next) {
    /*
     *  Il commento scritto da un utente (CONFERMATO e NON BANNATO) viene salvato nell'array dei commenti del post.
     */
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Post
                .findOne({'urlTitle': request.params.urlTitle})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else {
                        let newComment = new Comment (
                            {
                                userID: decoded.userID,
                                user: decoded.username,
                                content: request.body.comment,
                                likes: []
                            });
                        await newComment.save(function(errors) {
                            if(errors) {
                                return next(errors);
                            }
                            results.comments.push(newComment);
                            results.save(function(errors) {
                                if(errors) {
                                    return next(errors);
                                }
                                response.json({commented: true});
                            });
                        });
                    }
                });
        }
    });
}

exports.editComment = async function(request, response, next) {
    /*
     *  Esclusivamente l'autore del commento o un utente SUPER USER possono modificare il contenuto di un commento.
     */
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized:true});
        }
        else {
            await Comment
                .findById(request.params.commentID)
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else if(decoded.username == results.user) {
                        results.content = request.body.comment;
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

exports.deleteComment = async function(request, response, next) {
    /*
     *  Esclusivamente l'autore del commento o un utente SUPER USER possono eliminare un commento.
     */
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Comment
                .findById(request.params.commentID)
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else if(decoded.username == results.user || decoded.isSuperUser == true) {
                        await results.remove(function(errors) {
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

exports.deletePost = async function(request, response, next) {
    /*
     *  Esclusivamente l'autore del comunicato o un utente SUPER USER possono eliminare il comunicato.
     */
    jwt.verify(request.body.token, process.env.SECRET_KEY, async function(errors, decoded) {
        if(errors) {
            return next(errors);
        }
        if(decoded.isBanned == true || decoded.isConfirmed == false) {
            response.json({unauthorized: true});
        }
        else {
            await Post
                .findOne({'urlTitle': request.params.urlTitle})
                .exec(async function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    if(results == null) {
                        response.json({noResults: true});
                    }
                    else if(decoded.username == results.author || decoded.isSuperUser == true) {
                        await results.remove(function(errors) {
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
