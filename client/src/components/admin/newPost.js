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
import './admin.css';

class NewPost extends Component {

    constructor(props) {
        super(props);
        const content = EditorState.createEmpty();
        this.state = {
            title: '',
            subtitle: '',
            image: 'https://m5spiombino.s3.amazonaws.com/default.jpg',
            uploading: false,
            content,
            id: '',
            saved: false,
            postAlreadyExist: false,
            unauthorized: false,
            errors: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubtitleChange = this.handleSubtitleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.save = this.save.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleSubtitleChange(event) {
        this.setState({subtitle: event.target.value})
    }

    handleImageChange() {
        this.setState({uploading: true});
        const files = document.getElementById('image').files;
        const file = files[0];
        if(file == null) {
            this.setState({noFileSelected: true})
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/server/sign-s3?file-name=' + file.name + '&file-type=' + file.type);
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
        this.setState({
          content,
        });
      };

    async save() {
        if(this.state.title !== "") {
            var saved = false;
            var unauthorized = false;
            var postAlreadyExist = false;
            var _errors = false;
            await axios.post('/server/posts/newPost', {
                token: this.props.token,
                id: this.state.id,
                title: this.state.title,
                subtitle: this.state.subtitle,
                image: this.state.image,
                content: JSON.stringify(convertToRaw(this.state.content.getCurrentContent()))
            })
            .then(function(response) {
                if(response.data.created) {
                    saved = true;
                }
                else if(response.data.postAlreadyExist) {
                    postAlreadyExist = true;
                }
                else if(response.data.unauthorized) {
                    unauthorized = true;
                }
            })
            .catch(function(errors) {
                _errors = true;
            });
            this.setState({
                saved: saved,
                unauthorized: unauthorized,
                postAlreadyExist: postAlreadyExist,
                errors: _errors
            });
            window.scrollTo(0,5000);
            if(saved === true) {
                setTimeout(function() {window.location.replace('/admin/allPosts?page=1')}, 2000);
            }
        }
    }

    async componentDidMount() {
        await fetch('/server/posts/numberOfPosts')
        .then(response => response.json())
        .then((data) => this.setState({id: data.totalPosts}))
        .catch(console.log('Errore!'));
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
                                    error={this.state.postAlreadyExist}
                                    helperText='Esiste già un comunicato con lo stesso nome!'
                                    FormHelperTextProps={{hidden: !this.state.postAlreadyExist}}
                                    onChange={this.handleTitleChange}
                                    fullWidth
                                    defaultValue=""
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className="field"
                                    id="subtitle"
                                    label="Sottotitolo"
                                    required={true}
                                    disabled={this.state.saved}
                                    onChange={this.handleSubtitleChange}
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
                                <img src={this.state.image} alt="" style={{maxWidth: '90%'}}v/>
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
                            <div hidden={!this.state.postAlreadyExist}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Esiste già un comunicato con lo stesso nome!
                                </Alert>
                            </div>
                            <div hidden={!this.state.saved}>
                                <Alert variant="filled" severity="success" closeText='close'>
                                    Comunicato pubblicato correttamente!
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

export default NewPost;