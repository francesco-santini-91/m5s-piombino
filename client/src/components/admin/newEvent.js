import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';

class NewEvent extends Component {

    constructor(props) {
        super(props);
        const content = EditorState.createEmpty();
        this.state = {
            id: '',
            title: '',
            image: 'https://m5spiombino.s3.amazonaws.com/default.jpg',
            content,
            data: '',
            location: '',
            pastDate: false,
            saved: false,
            eventAlreadyExist: false,
            unauthorized: false,
            errors: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.defaultDate = this.defaultDate.bind(this);
        this.save = this.save.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleImageChange() {
        this.setState({uploading: true});
        const files = document.getElementById('image').files;
        const file = files[0];
        if(file == null) {
            this.setState({noFileSelected: true})
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:4000/server/sign-s3?file-name=' + file.name + '&file-type=' + file.type);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    const xhr2 = new XMLHttpRequest();
                    var update = new Promise(function(imageURL, userID) {
                        xhr2.open('PUT', response.returnData.url);
                        xhr2.onreadystatechange = () => {
                            if(xhr2.readyState === 4) {
                                if(xhr2.status === 200) {
                                    _imageURL = response.returnData.url;
                                    //this.setState({avatar: response.returnData.url});
                                }
                                else {
                                    //this.setState({errors: true});
                                }
                            }
                        }
                        xhr2.send(file);
                        imageURL(response.returnData.url);
                    });
                    var _imageURL;
                    update.then((imageURL) => this.setState({image: imageURL}));
                }
                else {
                    console.log('Errore!');
                }
            }
        }
        xhr.send();
    }

    handleContentChange(content) {
        this.setState({content});
    }

    handleDataChange(event) {
        this.setState({data: event.target.value});
        if(event.target.value < this.defaultDate()) {
            this.setState({pastDate: true});
        }
        else if(event.target.value >= this.defaultDate()) {
            this.setState({pastDate: false});
        }
    }

    handleLocationChange(event) {
        this.setState({location: event.target.value});
    }

    defaultDate() {
        let today = new Date();
        let day = today.getDate();
        if(day < 10) {day = '0'+day}
        let month = today.getMonth()+1;
        if(month < 10) {month = '0'+month}
        let year = today.getFullYear();
        return (year+'-'+month+'-'+day).toString();
    }

    async componentDidMount() {
        await fetch('http://localhost:4000/server/events/numberOfAllEvents')
        .then(response => response.json())
        .then((data) => this.setState({id: data.totalEvents}))
        .catch(console.log);
    }

    async save() {
        if(this.state.pastDate === false) {
            var saved = false;
            var eventAlreadyExist = false;
            var unauthorized = false;
            var _errors = false;
            await axios.post('http://localhost:4000/server/events/newEvent', {
                token: this.props.token,
                id: this.state.id,
                title: this.state.title,
                image: this.state.image,
                content: JSON.stringify(convertToRaw(this.state.content.getCurrentContent())),
                data: this.state.data,
                location: this.state.location
            })
            .then(function(response) {
                if(response.data.created) {
                    saved = true;
                }
                else if(response.data.unauthorized) {
                    unauthorized = true;
                }
                else if(response.data.eventAlreadyExist) {
                    eventAlreadyExist = true;
                }
            })
            .catch(function(errors) {
                console.log(errors);
                _errors = true;
            });
            this.setState({
                saved: saved,
                eventAlreadyExist: eventAlreadyExist,
                unauthorized: unauthorized,
                errors: _errors
            });
            window.scrollTo(0, 1000);
            if(saved === true) {
                setTimeout(function() {window.location.replace('/admin/allEvents?page=1')}, 2000);
            }
        }
    }

    render() {
        return(
            <div className="newEvent">
                <form className="fields" onSubmit={this.handleSubmit}>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '1000px'}}>
                        <Grid container spacing={1} className="newEvent" alignItems="flex-end">
                            <Grid item>
                                <TextField
                                    className="field"
                                    id="title"
                                    label="Titolo"
                                    required={true}
                                    disabled={this.state.saved}
                                    error={this.state.eventAlreadyExist}
                                    helperText='Esiste già un evento con lo stesso nome e la stessa data!'
                                    FormHelperTextProps={{hidden: !this.state.eventAlreadyExist}}
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
                                <img src={this.state.image} alt="" style={{maxWidth: '90%'}} />
                            </Grid>
                            <Grid item>
                                <input accept="image/jpeg" className="input" id="image" type="file" onChange={this.handleImageChange} />
                                    <label htmlFor="image" className="photoIcon">
                                        <IconButton color="primary" aria-label="upload picture" component="span">
                                            <PhotoCamera fontSize="large" /> 
                                        </IconButton>
                                    </label>
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
                            <TextField
                                id="data"
                                label="Data"
                                type="datetime-local"
                                disabled={this.state.saved}
                                error={this.state.pastDate}
                                helperText='La data deve essere futura!'
                                FormHelperTextProps={{hidden: !this.state.pastDate}}
                                onChange={this.handleDataChange}
                                defaultValue={this.defaultDate()}
                                className="field"
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className="field"
                                    id="location"
                                    label="Luogo"
                                    required={true}
                                    disabled={this.state.saved}
                                    onChange={this.handleLocationChange}
                                    fullWidth
                                    defaultValue=""
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained" 
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
                            <div hidden={!this.state.eventAlreadyExist}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Esiste già un evento con lo stesso nome e la stessa data!
                                </Alert>
                            </div>
                            <div hidden={!this.state.unauthorized}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Utente non autorizzato!
                                </Alert>
                            </div>
                            <div hidden={!this.state.saved}>
                                <Alert variant="filled" severity="success" closeText='close'>
                                    Evento pubblicato correttamente!
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

export default NewEvent;