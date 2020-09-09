import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import './admin.css';

class NewPoll extends Component {

    constructor(props) {
        super(props);
        const content = EditorState.createEmpty();
        this.state = {
            title: '',
            content,
            isActive: false,
            options: [],
            addOption: '',
            emptyOption: false,
            saved: false,
            pollAlreadyExist: false,
            unauthorized: false,
            errors: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleIsActiveChange = this.handleIsActiveChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.option = this.option.bind(this);
        this.showOptions = this.showOptions.bind(this);
        this.add = this.add.bind(this);
        this.addOption = this.addOption.bind(this);
        this.save = this.save.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleContentChange(content) {
        this.setState({content});
    }

    handleIsActiveChange(event) {
        this.setState({isActive: event.target.checked});
    }

    handleOptionChange(event) {
        this.setState({addOption: event.target.value.toUpperCase(), emptyOption: false});
    }

    option(ID, name) {
        return(
            <div className="option" key={ID}>
                Opzione {ID + 1} - {name}
            </div>
        );
    }

    showOptions() {
        let listOfOptions = [];
            for(let option of this.state.options) {
                listOfOptions.push(this.option(option.id, option.name));
            }
            return listOfOptions;
    }

    add() {
        if(this.state.addOption !== "") {
            this.state.options.push({
                id: this.state.options.length,
                name: this.state.addOption,
                votes: 0
            });
            this.setState({addOption: ''});
        }
        else {
            this.setState({emptyOption: true});
        }
    }

    addOption() {
        return(
            <div className="addOption">
                    <TextField
                        className="field"
                        id="option"
                        label="Aggiungi opzione"
                        disabled={this.state.saved}
                        onChange={this.handleOptionChange}
                        error={this.state.emptyOption}
                        helperText="L' opzione deve avere un contenuto!"
                        FormHelperTextProps={{hidden: !this.state.emptyOption}}
                        fullWidth
                        value={this.state.addOption}
                        variant="standard"
                    />
                    <Button 
                        variant="contained" 
                        size='large' 
                        className="SendButton" 
                        onClick={this.add}
                        disabled={this.state.saved}
                        >Aggiungi
                    </Button>
            </div>
        );
    }

    async save() {
        if(this.state.title !== "") {
            var saved = false;
            var unauthorized = false;
            var pollAlreadyExist = false;
            var _errors = false;
            await axios.post('/server/polls/newPoll', {
                token: this.props.token,
                title: this.state.title,
                content: JSON.stringify(convertToRaw(this.state.content.getCurrentContent())),
                isActive: this.state.isActive,
                options: this.state.options
            })
            .then(function(response) {
                if(response.data.created) {
                    saved = true;
                }
                else if(response.data.unauthorized) {
                    unauthorized = true;
                }
                else if(response.data.pollAlreadyExist) {
                    pollAlreadyExist = true;
                }
            })
            .catch(function(errors) {
                _errors = true;
            });
            this.setState({
                saved: saved,
                unauthorized: unauthorized,
                pollAlreadyExist: pollAlreadyExist,
                errors: _errors
            });
            window.scrollTo(0,5000);
            if(saved === true) {
                setTimeout(function() {window.location.replace('/admin/allPolls?page=1')}, 2000);
            }
        }
    }

    render() {
        return(
            <div className="newPost">
                <form className="fields" onSubmit={this.handleSubmit}>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '1000px'}}>
                        <Grid container spacing={1} className="newPost" alignItems="flex-end">
                            <Grid item>
                                <TextField
                                    className="field"
                                    id="title"
                                    label="Titolo"
                                    required={true}
                                    disabled={this.state.saved}
                                    error={this.state.pollAlreadyExist}
                                    helperText='Esiste già un sondaggio con lo stesso nome!'
                                    FormHelperTextProps={{hidden: !this.state.pollAlreadyExist}}
                                    onChange={this.handleTitleChange}
                                    fullWidth
                                    defaultValue=""
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className="field"
                                    id="author"
                                    label="Autore"
                                    required={true}
                                    disabled={true}
                                    defaultValue={this.props.username}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item>
                            <div className="editor">
                                <Editor 
                                    editorState={this.state.content}
                                    onEditorStateChange={this.handleContentChange}
                                />
                            </div>
                            </Grid>
                            <Grid item>
                            <div className="checks">
                                <FormControlLabel
                                    control={<Switch color="secondary" checked={this.state.check1} onChange={this.handleIsActiveChange} name="check1" />}
                                    label={this.state.isActive ? 'SONDAGGIO ATTIVO' : 'SONDAGGIO NON ATTIVO'}
                                />
                                </div>
                            </Grid>
                            <Grid item>
                                {this.showOptions()}
                                {this.addOption()}
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    color="secondary"
                                    size='large' 
                                    className="SendButton" 
                                    onClick={this.save}
                                    disabled={this.state.saved}
                                    >Salva
                                </Button>
                            </Grid>
                            <Grid item>
                            <div hidden={!this.state.errors}>
                                <Alert variant="filled" severity="error" closeText='close'>
                                    Errore!
                                </Alert>
                            </div>
                            <div hidden={!this.state.unauthorized}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Utente non autorizzato
                                </Alert>
                            </div>
                            <div hidden={!this.state.saved}>
                                <Alert variant="filled" severity="success" closeText='close'>
                                    Sondaggio pubblicato correttamente!
                                </Alert>
                            </div>
                            </Grid>
                        </Grid>
                    </Paper>
                </form>
            </div>
        );
    }
}

export default NewPoll;