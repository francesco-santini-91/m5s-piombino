import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';

class EditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            loaded: false,
            edited: false,
            unauthorized: false,
            noResults: false,
            errors: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleIsConfirmedChange = this.handleIsConfirmedChange.bind(this);
        this.handleIsAdminChange = this.handleIsAdminChange.bind(this);
        this.handleIsSuperUserChange = this.handleIsSuperUserChange.bind(this);
        this.handleIsBannedChange = this.handleIsBannedChange.bind(this);
        this.save = this.save.bind(this);
        this.abort = this.abort.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handleIsConfirmedChange(event) {
        this.setState({isConfirmed: event.target.checked});
    }

    handleIsAdminChange(event) {
        this.setState({isAdmin: event.target.checked});
    }

    handleIsSuperUserChange(event) {
        this.setState({isSuperUser: event.target.checked});
    }

    handleIsBannedChange(event) {
        this.setState({isBanned: event.target.checked});
    }

    async componentDidMount() {
        var loaded = false;
        var user = {};
        var unauthorized = false;
        var noResults = false;
        var _errors = false;
        await axios.post('/server/users/' + this.props.match.params.userID, {
            token: this.props.token
        })
        .then(function(response) {
            if(response.data.unauthorized) {
                unauthorized = true;
                loaded = true;
            }
            else if(response.data.noResults) {
                noResults = true;
                loaded = true;
            }
            else if(response.data.username !== "") {
                user = response.data;
                loaded = true;
            }
        })
        .catch(function(errors) {
            _errors = true;
            loaded = true;
        });
        this.setState({
            user: user,
            email: user.email,
            isConfirmed: user.isConfirmed,
            isBanned: user.isBanned,
            isAdmin: user.isAdmin,
            isSuperUser: user.isSuperUser,
            unauthorized: unauthorized,
            noResults: noResults,
            errors: _errors,
            loaded: loaded
        });
    }

    async save() {
        var edited = false;
        var unauthorized = false;
        var noResults = false;
        var _errors = false;
        await axios.put('/server/users/' + this.state.user._id, {
            token: this.props.token,
            email: this.state.email,
            isConfirmed: this.state.isConfirmed,
            isAdmin: this.state.isAdmin,
            isSuperUser: this.state.isSuperUser,
            isBanned: this.state.isBanned
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
            window.scrollTo(0, 5000);
            setTimeout(function() {window.location.replace('/admin/usersList')}, 2000);
        }
    }

    abort() {
        window.location.replace('/admin/usersList');
    }

    render() {
        if(this.state.loaded === false) {
            return(
                <div className="loading" hidden={this.state.loaded}>
                    <CircularProgress color="secondary" />
                </div>
            );
        }
        else if(this.state.loaded === true) {
            return(
                <div className="EditUser">
                    <form className="fields" onSubmit={this.handleSubmit}>
                        <Grid container spacing={1} className="username" alignItems="flex-end">
                            <Grid item style={{textAlign: '-webkit-center'}}>
                                <Avatar src={this.state.user.avatar} style={{width: 200, height: 200}}/>
                                <br />
                            </Grid>
                            <Grid item>
                                <TextField
                                    style={{width: '250px'}}
                                    className="field"
                                    id="email"
                                    label="Email"
                                    required={true}
                                    disabled={this.state.edited}
                                    onChange={this.handleEmailChange}
                                    value={this.state.email}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item>
                            <div className="checks">
                            <FormControlLabel
                                control={<Checkbox checked={this.state.isConfirmed} onChange={this.handleIsConfirmedChange} name="isConfirmed" />}
                                label="VERIFICATO"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.isAdmin} onChange={this.handleIsAdminChange} name="isAdmin" />}
                                label="ADMIN"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.isSuperUser} onChange={this.handleIsSuperUserChange} name="isSuperUser" />}
                                label="SUPER USER"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.isBanned} onChange={this.handleIsBannedChange} name="isBanned" />}
                                label="BLOCCATO"
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
                                    >SALVA MODIFICHE
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    size='large' 
                                    className="SendButton" 
                                    onClick={this.abort}
                                    disabled={this.state.saved}
                                    >INDIETRO
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
                                    Non disponi delle autorizzazioni necessarie!
                                </Alert>
                                </div>
                                <div hidden={!this.state.edited}>
                                <Alert variant="filled" severity="success" closeText='close'>
                                    Modifiche salvate con successo!
                                </Alert>     
                                </div>                 
                            </Grid>
                        </Grid>
                    </form>
                </div>
            );
        }
    }

}

export default EditUser;