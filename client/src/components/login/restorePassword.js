import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';
import querySearch from "stringquery";
import axios from 'axios';

class RestorePassword extends Component {

    constructor(props) {
        super(props);
        const token = querySearch(this.props.location.search).t;
        this.state = {
            username: this.props.match.params.username,
            token,
            password1: '',
            password2: '',
            passwordTooShort: false,
            passwordsDoesntMatch: false,
            saved: false,
            userNotFound: false,
            unauthorized: false,
            errors: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePassword1Change = this.handlePassword1Change.bind(this);
        this.handlePassword2Change = this.handlePassword2Change.bind(this);
        this.save = this.save.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handlePassword1Change(event) {
        this.setState({password1: event.target.value});
        if(event.target.value !== this.state.password2) {
            this.setState({passwordsDoesntMatch: true});
        }
        else if(event.target.value === this.state.password2){
            this.setState({passwordsDoesntMatch: false});
        }
        if(this.state.password1.length < 7) {
            this.setState({passwordTooShort: true});
        }
        else if(this.state.password1.length >= 7){
            this.setState({passwordTooShort: false});
        }
        this.forceUpdate();
    }

    handlePassword2Change(event) {
        this.setState({password2: event.target.value});
        if(this.state.password1 !== event.target.value) {
            this.setState({passwordsDoesntMatch: true});
        }
        else if(this.state.password1 === event.target.value){
            this.setState({passwordsDoesntMatch: false});
        }
        if(this.state.password1.length < 7) {
            this.setState({passwordTooShort: true});
        }
        else if(this.state.password1.length >= 7){
            this.setState({passwordTooShort: false});
        }
        this.forceUpdate();
    }

    async save() {
        var saved = false;
        var userNotFound = false;
        var unauthorized = false;
        var _errors = false;
        await axios.post('http://localhost:4000/server/users/restorePassword', {
            username: this.state.username,
            token: this.state.token,
            password: this.state.password1
        })
        .then(function(response) {
            if(response.data.saved) {
                saved = true;
            }
            else if(response.data.userNotFound) {
                userNotFound = true;
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
            userNotFound: userNotFound,
            unauthorized: unauthorized,
            errors: _errors
        });
        window.scrollTo(0, 5000);
        if(saved === true) {
            setTimeout(function() {window.location.replace('/login')}, 3000);
        }
    }

    render() {
        return(
            <div className="resetPassword">
                <form onSubmit={this.handleSubmit}>
                    <br />
                    <br />
                    <br />
                    <Grid container spacing={1} className="username" alignItems="flex-end">
                    <Grid item>
                        <TextField
                            className="field"
                            id="password1"
                            type="password"
                            label="Password"
                            required={true}
                            error={this.state.passwordTooShort}
                            helperText='Lunghezza minima 8 caratteri!'
                            FormHelperTextProps={{hidden: !this.state.passwordTooShort}}
                            onChange={this.handlePassword1Change}
                            defaultValue=""
                            variant="standard"
                            disabled={this.state.saved}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            className="field"
                            id="password2"
                            type="password"
                            label="Ripeti password"
                            required={true}
                            error={this.state.passwordsDoesntMatch}
                            helperText='Le password non corrispondono!'
                            FormHelperTextProps={{hidden: !this.state.passwordsDoesntMatch}}
                            onChange={this.handlePassword2Change}
                            defaultValue=""
                            variant="standard"
                            disabled={this.state.saved}
                        />
                    </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                size='large' 
                                className="SendButton" 
                                onClick={this.save}
                                >Invia
                            </Button>
                        </Grid>
                        <Grid item>
                            <div hidden={!this.state.userNotFound}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Nome utente inesistente!
                                </Alert>     
                            </div>
                            <div hidden={!this.state.unauthorized}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Non disponi delle autorizzazioni necessarie!
                                </Alert>     
                            </div>
                            <div hidden={!this.state.errors}>
                                <Alert variant="filled" severity="error" closeText='close'>
                                    Ops! Qualcosa sembra essere andato storto...
                                </Alert>     
                            </div>
                            <div hidden={!this.state.saved}>
                                <Alert variant="filled" severity="success" closeText='close'>
                                    Password cambiata correttamente!
                                </Alert>     
                            </div>
                    </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

export default RestorePassword;