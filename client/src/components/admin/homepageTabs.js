import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SingleTab from './singleTab';
import axios from 'axios';

class HomepageTabs extends Component {

    constructor(props) {
        super(props);
        const newTabContent = EditorState.createEmpty();
        this.state = {
            tabs: [],
            newTabTitle: '',
            newTabContent,
            loaded: false,
            addTab: false,
            saved: false,
            unauthorized: false,
            tabAlreadyExist: false,
            errors: false
        }
        this.loading = this.loading.bind(this);
        this.showTabs = this.showTabs.bind(this);
        this.handleOpenAddTab = this.handleOpenAddTab.bind(this);
        this.handleCloseAddTab = this.handleCloseAddTab.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.addTab = this.addTab.bind(this);
    }

    handleOpenAddTab() {
        this.setState({addTab: true});
    }

    handleCloseAddTab() {
        this.setState({addTab: false});
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleContentChange(newTabContent) {
        this.setState({newTabContent});
    }

    async addTab() {
        var saved = false;
        var unauthorized = false;
        var tabAlreadyExist = false;
        var _errors = false;
        await axios.post('http://localhost:4000/server/homepageTabs/addTab', {
            token: this.props.token,
            title: this.state.title,
            content: JSON.stringify(convertToRaw(this.state.newTabContent.getCurrentContent()))
        })
        .then(function(response) {
            if(response.data.saved) {
                saved = true;
            }
            else if(response.data.tabAlreadyExist) {
                tabAlreadyExist = true;
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
            saved: saved,
            tabAlreadyExist: tabAlreadyExist,
            unauthorized: unauthorized,
            errors: _errors
        });
        if(saved === true) {
            setTimeout(function() {window.location.replace('/admin/homepageTabs')}, 2000);
        }
    }

    async componentDidMount() {
        await fetch('http://localhost:4000/server/homepageTabs')
        .then(response => response.json())
        .then((data) => this.setState({tabs: data, loaded: true}))
        .catch(console.log);
    }

    loading() {
        return(
            <div className="loading" hidden={this.state.loaded}>
                <br />
                <br />
                <CircularProgress color="secondary" />
            </div>
        );
    }

    showTabs() {
        if(this.state.tabs.length === 0 && this.state.loaded === true) {
            return(
                <div className="noResults">
                    <Alert severity="warning">Non ci sono tabs</Alert>
                </div>
            );
        }
        else {
            let listOfTabs = [];
            for(let tab of this.state.tabs) {
                listOfTabs.push(<SingleTab
                                    key={tab._id}
                                    tabID={tab._id}
                                    title={tab.title}
                                    content={tab.content}
                                    token={this.props.token}
                                    isSuperUser={this.props.isSuperUser}
                                />);
            }
            return listOfTabs;
        }
    }

    render() {
        return(
            <div className="homepageTabs">
                {this.loading()}
                {this.showTabs()}
                <br />
                <Fab color="secondary" elevation={8} aria-label="add" onClick={this.handleOpenAddTab}>
                    <AddIcon />
                </Fab>
                <Dialog open={this.state.addTab} onClose={this.handleCloseAddTab} fullWidth aria-labelledby="form-dialog-title" style={{maxHeight: '90%'}}>
                    <DialogTitle id="form-dialog-title">Crea nuova tab</DialogTitle>
                    <DialogContent>
                        <div style={{marginBottom: '80px'}}>
                        <TextField
                            className="field"
                            id="title"
                            label="Titolo"
                            required={true}
                            disabled={this.state.edited}
                            onChange={this.handleTitleChange}
                            variant="standard"
                        />
                        <Editor 
                            editorState={this.state.newTabContent}
                            onEditorStateChange={this.handleContentChange}
                        />
                        </div>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleCloseAddTab} color="secondary">
                        Annulla
                    </Button>
                    <Button onClick={this.addTab} color="secondary">
                        Salva
                    </Button>
                    </DialogActions>
                    <div className="unauthorized" hidden={!this.state.saved}>
                        <Alert severity="success">Tab aggiunta con successo!</Alert>
                    </div>
                    <div className="unauthorized" hidden={!this.state.unauthorized}>
                        <Alert severity="warning">Non disponi delle autorizzazioni necessarie!</Alert>
                    </div>
                    <div className="tabAlreadyExist" hidden={!this.state.tabAlreadyExist}>
                        <Alert severity="warning">Esiste già una tab con questo nome!</Alert>
                    </div>
                    <div className="error" hidden={!this.state.errors}>
                        <Alert severity="error">Errore!</Alert>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default HomepageTabs;