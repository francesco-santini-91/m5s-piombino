import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';
import axios from 'axios';

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            userNotFound: false,
            sended: false,
            errors: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.send = this.send.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value, userNotFound: false});
    }

    async send() {
        var sended = false;
        var userNotFound = false;
        var _errors = false;
        await axios.post('/server/users/resetPassword', {
            email: this.state.email
        })
        .then(function(response) {
            if(response.data.sended) {
                sended = true;
            }
            else if(response.data.noResults) {
                userNotFound = true;
            }
        })
        .catch(function(errors) {
            _errors = true;
        });
        this.setState({
            sended: sended,
            userNotFound: userNotFound,
            errors: _errors
        });
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
                                style={{width: '250px'}}
                                autoFocus={true} 
                                required={true} 
                                error={this.state.userNotFound} 
                                FormHelperTextProps={{hidden: !this.state.userNotFound}} 
                                helperText='Utente non trovato!' 
                                id="email" 
                                onChange={this.handleEmailChange} 
                                label="Inserisci la tua Email" 
                            />
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                size='large' 
                                className="SendButton" 
                                onClick={this.send}
                                >Invia
                            </Button>
                        </Grid>
                        <Grid item>
                            <div hidden={!this.state.userNotFound}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Questa email non è associata ad alcun account!
                                </Alert>     
                            </div>
                            <div hidden={!this.state.errors}>
                                <Alert variant="filled" severity="error" closeText='close'>
                                    Ops! Qualcosa sembra essere andato storto...
                                </Alert>     
                            </div>
                            <div hidden={!this.state.sended}>
                                <Alert variant="filled" severity="success" closeText='close'>
                                    Abbiamo inviato una email al tuo indirizzo di posta. Clicca sul link allegato per accedere!
                                </Alert>     
                            </div>
                    </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

export default ForgotPassword;