import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import './login.css';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state= {
            usernameOrEmail: '',
            password: '',
            userNotFound: false,
            wrongPassword: false,
            authenticated: false,
            errors: false
        };
        this.login = this.login.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameOrEmailChange = this.handleUsernameOrEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.register = this.register.bind(this);
    }

    componentDidMount() {
        localStorage.clear();
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleUsernameOrEmailChange(event) {
        this.setState({usernameOrEmail: event.target.value, userNotFound: false});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value, wrongPassword: false});
    }

    async login() {
        var authenticated = false;
        var userNotFound = false;
        var wrongPassword = false;
        var errors = false;
        await axios.post('/server/login', {
            usernameOrEmail: this.state.usernameOrEmail,
            password: this.state.password
        })
        .then(function(response) {
            if(response.data.token) {
                localStorage.setItem('t', response.data.token);
                authenticated = true;
            }
            else if(response.data.userNotFound) {
                userNotFound = true;
            }
            else if(response.data.wrongPassword) {
                wrongPassword = true;
            }
            else {
                errors = true;
            }
        })
        .catch(function(error) {
            errors = true;         //  <--------------------------------------------------------------
        });
        if(authenticated === true) {
            this.setState({authenticated: true});
            window.location.replace('/profile');
        }
        else if(userNotFound === true) {
            this.setState({userNotFound: true});
        }
        else if(wrongPassword === true) {
            this.setState({wrongPassword: true});
        }
        else if(errors === true) {
            this.setState({errors: true});
            //window.location.reload();
        }
        else {
            //window.location.reload();
        }
    }

    register() {
        window.location.replace('/register');
    }

    render() {
        return(
            <div className="margin">
                <form onSubmit={this.handleSubmit}>
                    <Grid container spacing={1} className="username" alignItems="flex-end">
                    <Grid item>
                        <AccountCircle fontSize='large' />
                    </Grid>
                    <Grid item>
                        <TextField 
                            autoFocus={true} 
                            required={true} 
                            error={this.state.userNotFound} 
                            FormHelperTextProps={{hidden: !this.state.userNotFound}} 
                            helperText='Utente non trovato!' 
                            id="usernameOrEmail" 
                            onChange={this.handleUsernameOrEmailChange} 
                            label="Username o Email" 
                        />
                    </Grid>
                    </Grid>
                    <Grid container spacing={1} className="password" alignItems="flex-end">
                    <Grid item>
                        <TextField 
                            id="password" 
                            required={true} 
                            error={this.state.wrongPassword} 
                            FormHelperTextProps={{hidden: !this.state.wrongPassword}} 
                            helperText='Password errata!' 
                            type="password" 
                            label="Password" 
                            onChange={this.handlePasswordChange} 
                        />
                    </Grid>
                    </Grid>
                    <Grid container spacing={1} className="password" alignItems="flex-end">
                    <Grid item>
                        <Button 
                            variant="contained" 
                            size='large' 
                            className="LoginButton" 
                            onClick={this.login}
                            >Login
                        </Button>
                    </Grid>
                    <Grid item>
                        <a href="/resetPassword" style={{color: '#fcb02d', fontSize: '12px'}}>Password dimenticata?</a>
                    </Grid>
                    <Grid item>
                        <div hidden={!this.state.errors}>
                            <Alert variant="filled" severity="error" closeText='close'>
                                Ops! Qualcosa sembra essere andato storto...
                            </Alert>     
                        </div>
                    </Grid>
                    </Grid>
                    <Divider variant='middle' />
                    <Grid container spacing={1} className="password" alignItems="flex-end">
                    <Grid item>
                    <Typography variant="h6">Non hai un account?</Typography> 
                    </Grid>
                    </Grid>
                    <Grid container spacing={1} className="password" alignItems="flex-end">
                    <Grid item>
                        <Button 
                            variant="contained" 
                            size='large' 
                            color='secondary'
                            className="RegisterButton" 
                            onClick={this.register}>Registrati
                        </Button>
                    </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

export default Login;