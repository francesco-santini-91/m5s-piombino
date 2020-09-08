import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import './register.css';


class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            surname: '',
            dateOfBirth: '',
            email: '',
            password1: '',
            password2: '',
            check1: false,
            check2: false,
            passwordTooShort: false,
            passwordsDoesntMatch: false,
            underage: false,
            registered: false,
            userAlreadyExist: false,
            errors: false
        }
        this.defaultDate = this.defaultDate.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSurnameChange = this.handleSurnameChange.bind(this);
        this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePassword1Change = this.handlePassword1Change.bind(this);
        this.handlePassword2Change = this.handlePassword2Change.bind(this);
        this.handleCheck1Change = this.handleCheck1Change.bind(this);
        this.handleCheck2Change = this.handleCheck2Change.bind(this);
        this.register = this.register.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleSurnameChange(event) {
        this.setState({surname: event.target.value, userAlreadyExist: false});
    }

    handleDateOfBirthChange(event) {
        this.setState({dateOfBirth: event.target.value});
        if(event.target.value > this.defaultDate()) {
            this.setState({underage: true});
        }
        else if(event.target.value <= this.defaultDate()) {
            this.setState({underage: false});
        }
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value, userAlreadyExist: false});
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

    handleCheck1Change(event) {
        this.setState({check1: event.target.checked});
    }

    handleCheck2Change(event) {
        this.setState({check2: event.target.checked});
    }

    defaultDate() {
        let today = new Date();
        let day = today.getDate();
        if(day < 10) {day = '0'+day}
        let month = today.getMonth()+1;
        if(month < 10) {month = '0'+month}
        let year = today.getFullYear()-18;
        return (year+'-'+month+'-'+day).toString();
    }

    async register() {
        if(this.state.dateOfBirth === "") {
            this.setState({dateOfBirth: this.defaultDate().toString()});
        }
        this.setState({registered: false, userAlreadyExist: false, errors: false});
        if(this.state.passwordTooShort === false && 
            this.state.passwordsDoesntMatch === false && 
            this.state.underage === false && 
            this.state.check1 === true && 
            this.state.check2 === true) {
                var registered = false;
                var userAlreadyExist = false;
                var _errors = false;
                await axios.post('http://localhost:4000/server/users/register', {
                    username: this.state.username,
                    password: this.state.password1,
                    name: this.state.name,
                    surname: this.state.surname,
                    dateOfBirth: this.state.dateOfBirth.toString(),
                    email: this.state.email
                })
                .then(function(response) {
                    if(response.data.saved) {
                        registered = true;
                    }
                    else if(response.data.userAlreadyExist) {
                        userAlreadyExist = true;
                    }
                })
                .catch(function(errors) {
                    console.log(errors);        //  <-----------------------------------------------------
                    _errors = true;       
                });
                if(registered === true) {
                    this.setState({registered: true});
                    window.scrollTo(0, 200);
                }
                else if(userAlreadyExist === true) {
                    this.setState({userAlreadyExist: true});
                    window.scrollTo(0, 200);
                }
                else if(_errors === true) {
                    this.setState({errors: true});
                    window.scrollTo(0, 200);
                }
        }
    }

    render() {
        return(
            <div className='Register' hidden={this.state.registered}>
                <form className="fields" onSubmit={this.handleSubmit}>
                    <Grid container spacing={1} className="username" alignItems="flex-end">
                        <Grid item>
                            <TextField
                                className="field"
                                id="username"
                                label="Username"
                                required={true}
                                disabled={this.state.registered}
                                error={this.state.userAlreadyExist}
                                helperText='Username e/o Email già in uso!'
                                FormHelperTextProps={{hidden: !this.state.userAlreadyExist}}
                                onChange={this.handleUsernameChange}
                                defaultValue=""
                                variant="standard"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                className="field"
                                id="name"
                                label="Nome"
                                required={true}
                                disabled={this.state.registered}
                                onChange={this.handleNameChange}
                                defaultValue=""
                                helperText=""
                                variant="standard"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                className="field"
                                id="surname"
                                label="Cognome"
                                required={true}
                                disabled={this.state.registered}
                                onChange={this.handleSurnameChange}
                                defaultValue=""
                                helperText=""
                                variant="standard"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                style={{width: '182.4px'}}
                                id="dateOfBirth"
                                label="Data di nascita"
                                type="date"
                                required={true}
                                disabled={this.state.registered}
                                error={this.state.underage}
                                helperText='Devi avere almeno 18 anni!'
                                FormHelperTextProps={{hidden: !this.state.underage}}
                                onChange={this.handleDateOfBirthChange}
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
                                id="email"
                                type="email"
                                label="Email"
                                required={true}
                                disabled={this.state.registered}
                                onChange={this.handleEmailChange}
                                defaultValue=""
                                helperText=""
                                variant="standard"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                className="field"
                                id="password1"
                                type="password"
                                label="Password"
                                required={true}
                                disabled={this.state.registered}
                                error={this.state.passwordTooShort}
                                helperText='Lunghezza minima 8 caratteri!'
                                FormHelperTextProps={{hidden: !this.state.passwordTooShort}}
                                onChange={this.handlePassword1Change}
                                defaultValue=""
                                variant="standard"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                className="field"
                                id="password2"
                                type="password"
                                label="Ripeti password"
                                required={true}
                                disabled={this.state.registered}
                                error={this.state.passwordsDoesntMatch}
                                helperText='Le password non corrispondono!'
                                FormHelperTextProps={{hidden: !this.state.passwordsDoesntMatch}}
                                onChange={this.handlePassword2Change}
                                defaultValue=""
                                variant="standard"
                            />
                        </Grid>
                        <Grid item>
                            <div className="checks">
                            <FormControlLabel
                                control={<Checkbox checked={this.state.check1} onChange={this.handleCheck1Change} name="check1" />}
                                label="Accetto i termini di utilizzo"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.check2} onChange={this.handleCheck2Change} name="check2" />}
                                label="Acconsento al trattamento dei dati personali"
                            />
                            </div>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                size='large' 
                                className="SendButton" 
                                onClick={this.register}
                                disabled={this.state.registered}
                                >Invia
                            </Button>
                        </Grid>
                        <Grid item>
                            <div hidden={!this.state.errors}>
                            <Alert variant="filled" severity="error" closeText='close'>
                                Errore!
                            </Alert>
                            </div>
                            <div hidden={!this.state.userAlreadyExist}>
                            <Alert variant="filled" severity="warning" closeText='close'>
                                Username e/o Email già utilizzati!
                            </Alert>
                            </div>
                            <div hidden={!this.state.registered}>
                            <Alert variant="filled" severity="success" closeText='close'>
                                Account creato! Clicca sul link che ti abbiamo inviato via Email per confermarlo! Il link ha validità di un'ora.
                            </Alert>     
                            </div>                 
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

export default Register;