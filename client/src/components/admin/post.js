import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import './admin.css'

class Post extends Component {

    constructor(props) {
        super(props);
        const contentEdited = EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content)));
        this.state = {
            contentEdited,
            edit: false,
            edited: false,
            unauthorized: false,
            noResults: false,
            deleted: false,
            errors: false
        }
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleOpenEditTabs = this.handleOpenEditTabs.bind(this);
        this.handleCloseEditTabs = this.handleCloseEditTabs.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleOpenEditTabs() {
        this.setState({edit: true});
    }

    handleCloseEditTabs() {
        this.setState({edit: false});
    }

    handleContentChange(contentEdited) {
        this.setState({contentEdited});
    }

    async edit() {
        var edited = false;
        var unauthorized = false;
        var noResults = false;
        var _errors = false;
        await axios.put('http://localhost:4000/server/posts/' + this.props.urlTitle, {
            token: this.props.token,
            content: JSON.stringify(convertToRaw(this.state.contentEdited.getCurrentContent()))
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
            console.log(errors);
            _errors = true;
        });
        this.setState({
            edited: edited,
            noResults: noResults,
            unauthorized: unauthorized,
            errors: _errors
        });
        if(edited === true) {
            window.location.reload()
        }
    }

    async delete() {
        var unauthorized = false;
        var deleted = false;
        var _errors = false;
        if(this.props.isSuperUser === true || this.props.username === this.props.author) {
            await axios.patch('http://localhost:4000/server/posts/'+this.props.urlTitle, {
                token: this.props.token
            })
            .then(function(response) {
                if(response.data.deleted) {
                    deleted = true;
                }
                else if(response.data.unauthorized) {
                    unauthorized = true;
                }
            })
            .catch(function(errors) {
                console.log(errors);
                _errors = true;
            });
            this.setState({
                unauthorized: unauthorized,
                deleted: deleted,
                errors: _errors
            });
            if(deleted === true) {
                window.location.reload();
            }
        }
        else {
            this.setState({unauthorized: true});
        }
    }

    render() {
        return(
            <div className="post">
                <Card className="card" elevation={5} style={{maxWidth: '800px', margin: 'auto'}}>
                    <CardHeader title={this.props.title}
                                subheader={'Autore: ' + this.props.author}
                    />
                    <CardMedia className="media"
                                style={{height: 120, width: 250, margin: 'auto'}}
                                image={this.props.image}
                                title={this.props.image}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Data di pubblicazione: {this.props.data.substring(0,10).replace(/-/g, '/')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            ID: {this.props._id}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Likes: {this.props.likes}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Commenti: {this.props.comments}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <a href={'/posts/'+this.props.urlTitle}>Vai al comunicato</a>
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                            <IconButton aria-label="Modifica" color='secondary' fontSize='large' onClick={this.handleOpenEditTabs}>
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="Elimina" color='secondary' fontSize='large' onClick={this.delete}>
                                <DeleteIcon />
                            </IconButton>
                            <Dialog open={this.state.edit} onClose={this.handleCloseEditTabs} fullWidth aria-labelledby="form-dialog-title" style={{maxHeight: '90%'}}>
                                <DialogTitle id="form-dialog-title">Modifica</DialogTitle>
                                <DialogContent>
                                    <div style={{marginBottom: '80px'}}>
                                    <Editor 
                                        editorState={this.state.contentEdited}
                                        onEditorStateChange={this.handleContentChange}
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
                                <div className="unauthorized" hidden={!this.state.edited}>
                                    <Alert severity="success">Contenuto salvato con successo!</Alert>
                                </div>
                                <div className="unauthorized" hidden={!this.state.unauthorized}>
                                    <Alert severity="warning">Non disponi delle autorizzazioni necessarie!</Alert>
                                </div>
                                <div className="error" hidden={!this.state.errors}>
                                    <Alert severity="error">Errore!</Alert>
                                </div>
                            </Dialog>
                    </CardActions>
                    <div hidden={!this.state.errors}>
                        <Alert variant="filled" severity="error" closeText='close'>
                            Errore!
                        </Alert>
                    </div>
                    <div hidden={!this.state.unauthorized}>
                        <Alert variant="filled" severity="warning" closeText='close'>
                            Utente non autorizzato!
                        </Alert>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Post;