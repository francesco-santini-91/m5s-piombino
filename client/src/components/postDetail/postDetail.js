import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import user from '../../services/User';
import Comment from './comment';
import './postDetail.css';

class PostDetail extends Component {
    constructor(props) {
        super(props);
        const comment = EditorState.createEmpty();
        this.state = {
            loaded: false,
            postNotFound: false,
            post: {},
            token: localStorage.getItem('t'),
            isAuthenticated: '',
            userID: '',
            username: '',
            avatar: '',
            isConfirmed: '',
            isAdmin: '',
            isSuperUser: '',
            isBanned: '',
            comment,
            emptyComment: false,
            commented: false,
            noResults: false,
            unauthorized: false,
            errors: false,
            liked: false
        };
        this.formatData = this.formatData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.like = this.like.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.save = this.save.bind(this);
    }

    async componentDidMount() {
        await fetch('/server/posts/' + this.props.match.params.urlTitle)
        .then(response => response.json())
        .then((data) => this.setState({post: data, loaded: true}))
        .catch((errors) => console.log(errors));
        if(this.state.post.noResults === true) {
            this.setState({postNotFound: true});
        }
        else {
            this.setState({content: convertFromRaw(JSON.parse(this.state.post.content))});
        }
        if(this.state.loaded === true) {
            var auth, userID, username, avatar, isConfirmed, isAdmin, isSuperUser, isBanned;
        var _user = new user(localStorage.getItem('t'));
        await _user.isAuthenticated().then(function(result) {
            auth = result.authorized;
            userID = result.userID;
            username = result.username;
            avatar = result.avatar;
            isConfirmed = result.isConfirmed;
            isAdmin = result.isAdmin;
            isSuperUser = result.isSuperUser;
            isBanned = result.isBanned;

        });
        this.setState({
            isAuthenticated: auth,
            userID: userID,
            username: username,
            avatar: avatar,
            isConfirmed: isConfirmed,
            isAdmin: isAdmin,
            isSuperUser: isSuperUser,
            isBanned: isBanned
        });
        if(this.state.isAuthenticated === true) {
            let liked = false;
            var _errors = false;
            await axios.post('/server/posts/' + this.props.match.params.urlTitle + '/verifyLike', {
                userID: this.state.userID
            })
            .then(function(response) {
                if(response.data.liked === true) {
                    liked = true;
                }
            })
            .catch(function(errors) {
                _errors = true;
            });
            this.setState({liked: liked, errors: _errors});
        }
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleCommentChange(comment) {
        this.setState({comment, emptyComment: false});
    }

    formatData(data) {
        return data.substring(0,10).replace(/-/g, '/');
    }

    async like() {
        if(this.state.liked === false && this.state.isAuthenticated === true) {
            var liked = false;
            var noResults = false;
            var _errors = false;
            await axios.post('/server/posts/' + this.state.post.urlTitle + '/like', {
                userID: this.state.userID
            })
                .then(function(response) {
                    if(response.data.liked) {
                        liked = true;
                    }
                    else if(response.data.noResults) {
                        noResults = true;
                    }
                })
                .catch(function(errors) {
                    _errors = true;
                });
                this.setState({
                    liked: liked,
                    noResults: noResults,
                    errors: _errors
                });
                window.location.reload();
            }
    }

    async save() {
        var comment = convertToRaw(this.state.comment.getCurrentContent())
        if(comment.blocks[0].text === "") {
            this.setState({emptyComment: true});
        }
        else {
            var commented = false;
            var noResults = false;
            var unauthorized = false;
            var _errors = false;
            await axios.post('/server/posts/' + this.state.post.urlTitle + '/comment', {
                token: this.state.token,
                comment: JSON.stringify(convertToRaw(this.state.comment.getCurrentContent()))
            })
            .then(function(response) {
                if(response.data.commented) {
                    commented = true;
                }
                else if(response.data.noResults) {
                    noResults = true;
                }
                else if(response.data.unauthorized) {
                    unauthorized = true;
                }
            })
            .catch(function(errors) {
                _errors = true;
            });
            this.setState({
                commented: commented,
                noResults: noResults,
                unauthorized: unauthorized,
                errors: _errors
            });
            window.scrollTo(0, 5000);
            if(commented === true) {
                setTimeout(function() {window.location.reload()}, 2000);
            }
        }
    }

    showContent() {
        if(this.state.loaded === false) {
            return(
                <div className="loading" hidden={this.state.loaded}>
                    <CircularProgress color="secondary" />
                    <br />
                    <br />
                </div>
            );
        }
        else if(this.state.loaded === true && this.state.post.noResults === true) {
            return(
                <div className="error" hidden={!this.state.errors}>
                    <Alert severity="error">Articolo non trovato</Alert>
                </div>
            );
        }
        else if(this.state.loaded === true && this.state.post.title !== "") {
            const content = EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.post.content)));
            return(
                <div>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '1000px'}}>
                        <Grid container spacing={1} className="username" alignItems="flex-end">
                            <Grid item>
                                <Typography variant="h4" gutterBottom>
                                    {this.state.post.title}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" gutterBottom>
                                    {this.state.post.subtitle}
                                </Typography>
                            </Grid>
                            <Grid item>
                            <Typography variant="body1" gutterBottom>
                                    Pubblicato in data {this.state.post.data === undefined ? '' : this.formatData(this.state.post.data)}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <img src={this.state.post.image} alt="" style={{maxHeight: '100%', maxWidth: '100%'}}></img>
                            </Grid>
                            <Grid item>
                            <Editor
                                editorState={content}
                                readOnly={true}
                                toolbarHidden={true}
                            />
                                
                            </Grid>
                            <Grid item>
                            <FormControlLabel
                                control={<Checkbox checked={this.state.liked} icon={<StarBorderRoundedIcon fontSize='large' />} checkedIcon={<StarRoundedIcon fontSize='large'/>} name="likes" />}
                                onClick={this.like}
                                label={this.state.post.likes.length}
                            />
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            );
        }
    }

    showComments() {
        if(this.state.loaded === true) {
            if(this.state.post.noResults !== true) {
                if(this.state.post.comments.length === 0) {
                    return(
                        <div className="noResults">
                            <Alert severity="info">Non ci sono commenti</Alert>
                        </div>
                        );
                }
                else {
                    let listOfComment = [];
                    for(let comment of this.state.post.comments) {
                        listOfComment.push(<Comment
                                                key={comment._id}
                                                urlTitle={this.state.post.urlTitle}
                                                token={this.state.token}
                                                commentID={comment._id}
                                                userID={comment.userID}
                                                user={comment.user}
                                                content={comment.content}
                                                likes={comment.likes.length}
                                                isAuthenticated={this.state.isAuthenticated}
                                                _username={this.state.username}
                                                _userID={this.state.userID}
                                                _isAdmin={this.state.isAdmin}
                                                _isSuperUser={this.state.isSuperUser}
                                                _isBanned={this.state.isBanned}
                                            />)
                    }
                    return listOfComment;
                }
            }
        }
    }

    postComment() {
        if(this.state.loaded === true) {
            if(this.state.post.noResults !== true) {
                if(this.state.isAuthenticated === false) {
                    return(
                        <div className="noAuth">
                            <Alert severity="warning"><a href="/login">Accedi</a> o <a href="/register">registrati</a> per commentare</Alert>
                        </div>
                    );
                }
                else {
                    return(
                        <div className="auth">
                            <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '1000px'}}>
                            <div hidden={!this.state.emptyComment}>
                                    <Alert severity="error">Il commento non può essere vuoto!</Alert>
                            </div>
                            <div className="newComment">
                                <Avatar alt="" src={this.state.avatar} style={{width: 56, height:56, marginRight:8, marginTop: 32}}/>
                                <div className="editor" style={{width: '100%'}}>
                                <Editor 
                                    toolbar={{options: ['emoji', 'link']}}
                                    editorState={this.state.comment}
                                    onEditorStateChange={this.handleCommentChange}
                                />
                                </div>
                                    <Button 
                                        variant="contained" 
                                        size='large' 
                                        className="SendButton" 
                                        onClick={this.save}
                                        onSubmit={this.handleSubmit}
                                        disabled={this.state.commented}
                                        >Invia
                                    </Button>
                                </div>
                            </Paper>
                        </div>
                    );
                }
            }
        }
    }

    render() {
        return(
            <div className="postDetail">
                {this.showContent()}
                <br />
                {this.showComments()}
                <div className="error" hidden={!this.state.post.noResults}>
                    <Alert severity="error">Articolo non trovato</Alert>
                </div>
                <div className="success" hidden={!this.state.commented}>
                    <Alert severity="success">Commento salvato</Alert>
                </div>
                <div className="unauthorized" hidden={!this.state.unauthorized}>
                    <Alert severity="warning">Non disponi delle autorizzazioni necessarie!</Alert>
                </div>
                <div className="error" hidden={!this.state.errors}>
                    <Alert severity="error">Errore!</Alert>
                </div>
                <div className="comments">
                    {this.postComment()}
                </div>
                
            </div>
        );
    }
}

export default PostDetail;