import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

class SingleTab extends Component {

    constructor(props) {
        super(props);
        const title = this.props.title;
        const contentEdited = EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content)));
        this.state = {
            title,
            contentEdited,
            edit: false,
            edited: false,
            unauthorized: false,
            noResults: false,
            deleted: false,
            errors: false
        }
        this.handleTitleChange = this.handleTitleChange.bind(this);
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

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    async edit() {
        var edited = false;
        var unauthorized = false;
        var noResults = false;
        var _errors = false;
        await axios.put('http://localhost:4000/server/homepageTabs/' + this.props.tabID, {
            token: this.props.token,
            title: this.state.title,
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
        var noResults = false;
        var deleted = false;
        var _errors = false;
        if(this.props.isSuperUser === true) {
            await axios.patch('http://localhost:4000/server/homepageTabs/' + this.props.tabID, {
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
            .catch(function(errors) {
                console.log(errors);
                _errors = true;
            });
            this.setState({
                unauthorized: unauthorized,
                deleted: deleted,
                noResults: noResults,
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
            <div className="singleTab">
                <br />
                <Card style={{padding: '10px', margin: 'auto', maxWidth: '400px'}}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            {this.props.title}
                        </Typography>
                        
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={this.handleOpenEditTabs}>MODIFICA</Button>
                        <Button size="small" onClick={this.delete}>ELIMINA</Button>
                    </CardActions>
                    <Dialog open={this.state.edit} onClose={this.handleCloseEditTabs} fullWidth aria-labelledby="form-dialog-title" style={{maxHeight: '90%'}}>
                                <DialogTitle id="form-dialog-title">Modifica</DialogTitle>
                                <DialogContent>
                                    <div style={{marginBottom: '80px'}}>
                                    <TextField
                                        className="field"
                                        id="title"
                                        label="Titolo"
                                        required={true}
                                        disabled={this.state.edited}
                                        onChange={this.handleTitleChange}
                                        defaultValue={this.state.title}
                                        variant="standard"
                                    />
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
                    </Card>
            </div>
        );
    }
}

export default SingleTab;