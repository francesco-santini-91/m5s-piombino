import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CheckIcon from '@material-ui/icons/Check';
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';
import BlockIcon from '@material-ui/icons/Block';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'axios';
import './profile.css';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailSended: false,
            editProfile: false,
            avatar: null,
            file: null,
            noFileSelected: false,
            uploading: false,
            updated: false,
            oldPassword: '',
            newPassword1: '',
            newPassword2: '',
            name: '',
            surname: '',
            dateOfBirth: '',
            email: '',
            registrationDate: '',
            oldPasswordError: false,
            passwordTooShort: false,
            passwordsDoesntMatch: false,
            saved: false,
            sended: false,
            errors: false,
            unauthorized: false,
            noResults: false
        }
        this.sendEmail = this.sendEmail.bind(this);
        this.showEditSection = this.showEditSection.bind(this);
        this.hideEditSection = this.hideEditSection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
        this.handlePassword1Change = this.handlePassword1Change.bind(this);
        this.handlePassword2Change = this.handlePassword2Change.bind(this);
        this.save = this.save.bind(this);
        this.goToAdminPanel = this.goToAdminPanel.bind(this);
        this.goToSuperUserPanel = this.goToSuperUserPanel.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        var avatar, name, surname;
        await axios.post('http://localhost:4000/server/users/' + this.props.userID, {
            token: this.props.token
        })
        .then(function(response) {
            avatar = response.data.avatar;
            name = response.data.name;
            surname = response.data.surname;
        })
        .catch(function(errors) {
            console.log(errors);
        });
        this.setState({
            avatar: avatar,
            name: name,
            surname: surname
        });
    }

    async sendEmail() {
        var sended = false;
        var noResults = false;
        var unauthorized = false;
        var _errors = false;
        await axios.post('http://localhost:4000/server/users/resend', {
            token: this.props.token
        })
        .then(function(response) {
            if(response.data.sended) {
                sended = true;
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
            sended: sended,
            noResults: noResults,
            unauthorized: unauthorized,
            errors: _errors
        });
            window.scrollTo(0, 5000);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleAvatarChange() {
        this.setState({uploading: true});
        const userID = this.props.userID;
        const token = this.props.token;
        const files = document.getElementById('avatar').files;
        const file = files[0];
        if(file == null) {
            this.setState({noFileSelected: true})
        }
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:4000/server/sign-s3?file-name=' + this.props.userID + '&file-type=' + file.type);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    const xhr2 = new XMLHttpRequest();
                    var update = new Promise(function(avatarURL, userID) {
                        xhr2.open('PUT', response.returnData.url);
                        xhr2.onreadystatechange = () => {
                            if(xhr2.readyState === 4) {
                                if(xhr2.status === 200) {
                                    //this.setState({avatar: response.returnData.url});
                                }
                                else {
                                    //this.setState({errors: true});
                                }
                            }
                        }
                        xhr2.send(file);
                        avatarURL(response.returnData.url);
                    });
                    update.then(async function(avatarURL) {
                        var updated = false;
                        var _errors = false;
                        axios.put('http://localhost:4000/server/users/' + userID + '/upload', {
                            token: token,
                            avatar: avatarURL
                        })
                        .then(function(response) {
                            console.log(response)
                            if(response.data.updated) {
                                updated = true;
                                window.location.reload();
                            }
                        })
                        .catch(function(errors) {
                            console.log(errors);
                            _errors = true;
                        });
                       /* this.setState({
                            updated: updated,
                            errors: _errors
                        });*/
                        
                    });
                }
                else {
                    console.log('Errore!');
                }
            }
        }
        xhr.send();
        this.setState({uploading: false})
    }

    handleOldPasswordChange(event) {
        this.setState({oldPassword: event.target.value, oldPasswordError: false});
    }

    handlePassword1Change(event) {
        this.setState({newPassword1: event.target.value});
        if(event.target.value !== this.state.newPassword2) {
            this.setState({passwordsDoesntMatch: true});
        }
        else if(event.target.value === this.state.newPassword2){
            this.setState({passwordsDoesntMatch: false});
        }
        if(this.state.newPassword1.length < 7) {
            this.setState({passwordTooShort: true});
        }
        else if(this.state.newPassword1.length >= 7){
            this.setState({passwordTooShort: false});
        }
        this.forceUpdate();
    }

    handlePassword2Change(event) {
        this.setState({newPassword2: event.target.value});
        if(this.state.newPassword1 !== event.target.value) {
            this.setState({passwordsDoesntMatch: true});
        }
        else if(this.state.newPassword1 === event.target.value){
            this.setState({passwordsDoesntMatch: false});
        }
        if(this.state.newPassword1.length < 7) {
            this.setState({passwordTooShort: true});
        }
        else if(this.state.newPassword1.length >= 7){
            this.setState({passwordTooShort: false});
        }
        this.forceUpdate();
    }


   async showEditSection() {
        this.setState({editProfile: true});
        var unauthorized = false;
        var noResults = false;
        var _errors = false;
        var password, name, surname, dateOfBirth, registrationDate, email;
        await axios.post('http://localhost:4000/server/users/' + this.props.userID, {
            token: this.props.token
        })
        .then(function(response) {
            if(response.data.unauthorized) {
                unauthorized = true;
            }
            else if(response.data.noResults) {
                noResults = true;
            }
            else if(response.data.email != null) {
                name = response.data.name;
                surname = response.data.surname;
                dateOfBirth = response.data.dateOfBirth;
                registrationDate = response.data.registrationDate;
                email = response.data.email;
            }
        })
        .catch(function(errors) {
            console.log(errors);
            _errors = true;
        });
            this.setState({
                unauthorized: unauthorized,
                noResults: noResults,
                errors: _errors,
                oldPassword: password,
                name: name,
                surname: surname,
                dateOfBirth: dateOfBirth.substring(0,10).replace(/-/g, '/'),
                registrationDate: registrationDate.substring(0,10).replace(/-/g, '/'),
                email: email
            });
    }

    hideEditSection() {
        this.setState({editProfile: false})
    }

    async save() {
        if(this.state.oldPasswordError === false && this.state.oldPassword !== null &&
            this.state.passwordTooShort === false && this.state.newPassword1 !== null &&
            this.state.passwordsDoesntMatch === false && this.state.newPassword2 !== null) {
                var noResults = false;
                var wrongPassword = false;
                var unauthorized = false;
                var edited = false;
                var _errors = false;
                await axios.put('http://localhost:4000/server/users/' + this.props.userID, {
                    token: this.props.token,
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.newPassword1,
                    name: this.state.name,
                    surname: this.state.surname,
                    dateOfBirth: this.state.dateOfBirth
                })
                .then(function(response) {
                    if(response.data.userNotFound) {
                        noResults = true;
                    }
                    else if(response.data.wrongPassword) {
                        wrongPassword = true;
                    }
                    else if(response.data.unauthorized) {
                        unauthorized = true;
                    }
                    else if(response.data.edited) {
                        edited = true;
                    }
                })
                .catch(function(errors) {
                    console.log(errors);
                    _errors = true;
                });
                this.setState({
                    noResults: noResults,
                    oldPasswordError: wrongPassword,
                    unauthorized: unauthorized,
                    errors: _errors,
                    saved: edited
                });
                if(edited === true) {
                    window.scrollTo(0, 5000);
                    setTimeout(function() {window.location.reload()}, 2000);
                }
            }
    }

    goToAdminPanel() {
        window.location.replace('/admin');
    }

    goToSuperUserPanel() {
        window.location.replace('/superUser')
    }

    logout() {
        window.location.replace('/login');
    }

    render() {
        return(
            <div className="profile">
                <Grid container spacing={1}>
                    <Grid item xs={1} sm container>
                        <Grid item xs container spacing={1}>
                            <Grid item xs container justify="flex-start" spacing={1} style={{textAlign: '-webkit-center'}}>
                                <Grid item>
                                    <Avatar alt="" src={this.state.avatar} style={{width: 200, height: 200}} />
                                </Grid>
                                <Grid item>
                                    <div hidden={this.state.uploading}>
                                    <input accept="image/jpeg" className="input" id="avatar" type="file" onChange={this.handleAvatarChange} />
                                        <label htmlFor="avatar" className="photoIcon">
                                            <IconButton color="primary" aria-label="upload picture" component="span">
                                                <PhotoCamera color="secondary" fontSize="large" /> 
                                            </IconButton>
                                        </label>
                                    </div>
                                        <div className="loading" hidden={!this.state.uploading}>
                                            <CircularProgress color="secondary" />
                                        </div>
                                        <div hidden={!this.state.noFileSelected}>
                                            <Alert variant="filled" severity="warning" closeText='close'>
                                                Nessun file caricato!
                                            </Alert>
                                        </div>
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                    {this.state.name === undefined ? '' : this.state.name+' '+this.state.surname}
                                </Typography>

                                <div className="chips" hidden={this.props.isBanned} style={{display: 'block'}}>
                                    <div className="verified" hidden={!this.props.isConfirmed}>
                                        <Chip size="small" icon={<CheckIcon style={{color: '#ffffff'}}/>} label="Verificato" style={{backgroundColor: '#449c43', color: '#ffffff'}}/>
                                    </div>
                                    <div className="notVerified" hidden={this.props.isConfirmed}>
                                        <Chip size="small" icon={<ClearIcon style={{color: '#ffffff'}}/>} label="Da verificare" style={{backgroundColor: '#ef2d2d', color: '#ffffff'}}/> <br />
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className="button"
                                            startIcon={<EmailRoundedIcon />}
                                            onClick={this.sendEmail}
                                        >
                                            INVIA NUOVAMENTE EMAIL
                                        </Button>
                                    </div>
                                    <div className="verified" hidden={!this.props.isSuperUser}>
                                        <Chip size="small" icon={<CheckIcon style={{color: '#ffffff'}}/>} label="Super User" style={{backgroundColor: '#2196f3', color: '#ffffff'}}/>
                                    </div>
                                    <div className="verified" hidden={!this.props.isAdmin}>
                                        <Chip size="small" icon={<CheckIcon style={{color: '#ffffff'}}/>} label="Admin" style={{backgroundColor: '#fcb02d', color: '#ffffff'}}/>
                                    </div>
                                </div>
                                <div hidden={!this.props.isBanned}>
                                    <Chip icon={<BlockIcon style={{color: '#ffffff'}}/>} label="ACCOUNT BLOCCATO" style={{backgroundColor: '#ef2d2d', color: '#ffffff', marginTop: '3px'}}/>
                                </div>
                                <div hidden={this.state.editProfile}>
                                    <Button
                                            variant="contained"
                                            color="secondary"
                                            className="button"
                                            startIcon={<EditRoundedIcon />}
                                            disabled={this.props.isBanned}
                                            onClick={this.showEditSection}
                                    >
                                            MODIFICA PROFILO
                                    </Button>
                                </div>
                                <div hidden={!(this.props.isAdmin || this.props.isSuperUser)}>
                                    <div hidden={this.state.editProfile}>
                                        <Button
                                                variant="contained"
                                                color="secondary"
                                                className="button"
                                                startIcon={<SettingsIcon />}
                                                onClick={this.goToAdminPanel}
                                        >
                                                PANNELLO ADMIN
                                        </Button>
                                    </div>
                                </div>
                                <div hidden={this.state.editProfile}>
                                    <Button
                                            variant="contained"
                                            style={{backgroundColor: '#1c1e21', color: '#ffffff'}}
                                            className="button"
                                            startIcon={<ExitToAppIcon />}
                                            onClick={this.logout}
                                    >
                                            LOGOUT
                                    </Button>
                                </div>
                                <div className="editSection" hidden={!this.state.editProfile}>
                                    <form className="fields" onSubmit={this.handleSubmit}>
                                        <Grid container spacing={1} className="username" alignItems="flex-end">
                                            <Grid item>
                                                <TextField
                                                    className="field"
                                                    id="oldPassword"
                                                    type="password"
                                                    label="Vecchia password"
                                                    required={true}
                                                    onChange={this.handleOldPasswordChange}
                                                    error={this.state.oldPasswordError} 
                                                    FormHelperTextProps={{hidden: !this.state.oldPasswordError}} 
                                                    helperText='Password errata!'
                                                    variant="standard"
                                                    disabled={this.state.saved}
                                                />
                                            </Grid>
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
                                                <TextField
                                                    className="field"
                                                    id="name"
                                                    label="Nome"
                                                    required={true}
                                                    disabled={true}
                                                    value={this.state.name}
                                                    variant="standard"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    className="field"
                                                    id="surname"
                                                    label="Cognome"
                                                    required={true}
                                                    disabled={true}
                                                    value={this.state.surname}
                                                    variant="standard"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    className="field"
                                                    id="email"
                                                    label="Email"
                                                    required={true}
                                                    disabled={true}
                                                    value={this.state.email}
                                                    variant="standard"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    className="field"
                                                    id="dateOfBirth"
                                                    label="Data di nascita"
                                                    required={true}
                                                    disabled={true}
                                                    value={this.state.dateOfBirth === undefined ? '' : this.state.dateOfBirth}
                                                    variant="standard"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    className="field"
                                                    id="registrationDate"
                                                    label="Data registrazione"
                                                    required={true}
                                                    disabled={true}
                                                    value={this.state.registrationDate === undefined ? '' : this.state.registrationDate}
                                                    variant="standard"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button 
                                                    variant="contained" 
                                                    size='large' 
                                                    className="SendButton" 
                                                    onClick={this.hideEditSection}
                                                    disabled={this.state.saved}
                                                    >Annulla
                                                </Button>
                                                <Button 
                                                    variant="contained" 
                                                    size='large' 
                                                    className="SendButton" 
                                                    onClick={this.save}
                                                    disabled={this.state.saved}
                                                    >Salva
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </div>  
                            </Grid>
                            <Grid item>
                            <div hidden={!this.state.sended}>
                                <Alert variant="filled" severity="success" closeText='close'>
                                    Email inviata! Clicca il link allegato entro un'ora per confermare l'account!
                                </Alert>     
                            </div>   
                            <div hidden={!this.state.errors}>
                                <Alert variant="filled" severity="error" closeText='close'>
                                    Errore!
                                </Alert>
                            </div>
                            <div hidden={!this.state.noResults}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Utente non trovato!
                                </Alert>
                            </div>
                            <div hidden={!this.state.unauthorized}>
                                <Alert variant="filled" severity="warning" closeText='close'>
                                    Non disponi delle autorizzazioni necessarie!
                                </Alert>
                            </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Profile;