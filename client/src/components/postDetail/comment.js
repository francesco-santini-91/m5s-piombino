import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import axios from 'axios';
import './comment.css';

class Comment extends Component {

    constructor(props) {
        super(props);
        const commentEdited = EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content)));
        this.state = {
            user: {},
            loaded: false,
            edit: false,
            commentEdited,
            emptyComment: false,
            deleted: false,
            unauthorized: false,
            noResults: false,
            errors: false,
            liked: false
        };
        this.wrapper = React.createRef();
        this.like = this.like.bind(this);
        this.handleOpenEditTabs = this.handleOpenEditTabs.bind(this);
        this.handleCloseEditTabs = this.handleCloseEditTabs.bind(this);
        this.handleEditComment = this.handleEditComment.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleOpenEditTabs() {
        this.setState({edit: true});
    }

    handleCloseEditTabs() {
        this.setState({edit: false});
    }

    handleEditComment(commentEdited) {
        this.setState({commentEdited, emptyComment: false});
    }

    async componentDidMount() {
        var liked = false;
        var loaded = false;
        var user = {};
        var _errors = false;
        var _userID = this.props._userID;
        await axios.get('/server/users/' + this.props.userID)
        .then(function(response) {
            if(response.data !== null) {
                user = response.data;
                loaded = true;
            }
        })
        .catch(function(errors) {
            _errors = true;
        });
        this.setState({user: user, loaded: loaded});
        if(this.props.isAuthenticated === true) {
            await axios.post('/server/posts/' + this.props.urlTitle + '/' + this.props.commentID + '/verifyLike', {
                userID: this.props._userID
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

    async like() {
        if(this.state.liked === false && this.props._username !== "") {
            var liked = false;
            var noResults = false;
            var _errors = false;
            await axios.post('/server/posts/' + this.props.urlTitle + '/' + this.props.commentID + '/like', {
                userID: this.props._userID
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

    async edit() {
        var commentEdited = convertToRaw(this.state.commentEdited.getCurrentContent())
        if(commentEdited.blocks[0].text === "") {
            this.setState({emptyComment: true});
        }
        else {
            var edited = false;
            var unauthorized = false;
            var noResults = false;
            var _errors = false;
            await axios.put('/server/posts/' + this.props.urlTitle + '/' + this.props.commentID, {
                token: this.props.token,
                comment: JSON.stringify(convertToRaw(this.state.commentEdited.getCurrentContent()))
            })
            .then(function(response) {
                if(response.data.edited) {
                    edited = true;
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
                edited: edited,
                noResults: noResults,
                unauthorized: unauthorized,
                errors: _errors
            });
            if(edited === true) {
                window.location.reload();
            }
        }
    }

    async delete() {
        var deleted = false;
        var unauthorized = false;
        var noResults = false;
        var _errors = false;
        await axios.patch('/server/posts/' + this.props.urlTitle + '/' + this.props.commentID, {
            token: this.props.token
        })
        .then(function(response) {
            if(response.data.deleted) {
                deleted = true;
            }
            else if(response.data.unauthorized) {
                unauthorized = true;
            }
            else if(response.data.noResults) {
                noResults = true;
            }
        })
        .then(function(errors) {
            _errors = true;
        });
        this.setState({
            deleted: deleted,
            noResults: noResults,
            unauthorized: unauthorized,
            errors: _errors,
            edit: false
        });
        if(deleted === true) {
            window.location.reload();
        }
    }

    render() {
        let rights = false
        if(this.props._username === this.props.user || this.props._isSuperUser === true) {
            rights = true;
        }
        const comment = EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content)));
        return(
            <div className="comment" ref={this.wrapper}>
                <Card className="card" elevation={5} style={{maxWidth: '1020px', margin: 'auto'}}>
                    <CardHeader
                        avatar={
                            <Avatar alt="" src={this.state.user.avatar} />
                        }
                        title={this.props.user}
                        subheader={this.state.user.name + ' ' + this.state.user.surname}
                    />
                    <Divider variant="middle" />
                    <CardContent>
                        <Editor
                            editorState={comment}
                            readOnly={true}
                            toolbarHidden={true}
                        />
                    </CardContent>
                    <CardActions disableSpacing>
                        <div className="bottomCard">
                            <div>
                            <FormControlLabel
                                control={<Checkbox checked={this.state.liked} icon={<StarBorderRoundedIcon fontSize='large' />} checkedIcon={<StarRoundedIcon fontSize='large' />} name="likes" />}
                                onClick={this.like}
                                label={this.props.likes}
                            />
                            </div>
                            <div className="actions" hidden={!rights}>
                                <IconButton aria-label="Modifica" onClick={this.handleOpenEditTabs}>
                                    <EditRoundedIcon />
                                </IconButton>
                                <IconButton aria-label="Elimina" onClick={this.delete}>
                                    <DeleteRoundedIcon />
                                </IconButton>
                            </div>
                            <Dialog open={this.state.edit} onClose={this.handleCloseEditTabs} fullWidth aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Modifica</DialogTitle>
                                <DialogContent>
                                    <div>
                                    <Editor 
                                        toolbar={{options: ['emoji', 'link']}}
                                        editorState={this.state.commentEdited}
                                        onEditorStateChange={this.handleEditComment}
                                    />
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={this.handleCloseEditTabs} color="secondary">
                                    Annulla
                                </Button>
                                <Button onClick={this.edit} color="secondary">
                                    Salva
                                </Button>
                                </DialogActions>
                            </Dialog>
                            <div className="unauthorized" hidden={!this.state.unauthorized}>
                                <Alert severity="warning">Non disponi delle autorizzazioni necessarie!</Alert>
                            </div>
                            <div className="error" hidden={!this.state.errors}>
                                <Alert severity="error">Errore!</Alert>
                            </div>
                        </div>
                    </CardActions>
                </Card>
                <br />
            </div>
        );
    }
}

export default Comment;