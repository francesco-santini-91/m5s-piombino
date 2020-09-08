import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';

import axios from 'axios';
import './admin.css';

class AllUsers__Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loaded: false,
            edit: false,
            edited: false,
            noResults: false,
            unauthorized: false,
            errors: false
        };
        this.formatUsername = this.formatUsername.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editUser = this.editUser.bind(this);
    }

    async componentDidMount() {
        var loaded = false;
        var users = [];
        var unauthorized = false;
        var noResults = false;
        var _errors = false;
        await axios.post('http://localhost:4000/server/users', {
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
            else if(response.data.length > 0) {
                users = response.data;
                loaded = true;
            }
        })
        .catch(function(errors) {
            console.log(errors);
            _errors = true;
            loaded = true;
        });
        this.setState({
            users: users,
            unauthorized: unauthorized,
            noResults: noResults,
            errors: _errors,
            loaded: loaded
        });
    }

    formatUsername(username, isConfirmed, isBanned, isAdmin, isSuperUser) {
        if(isBanned === true) {
            return <span style={{color: '#ff0000'}}>{username}</span>
        }
        else if(isSuperUser === true) {
            return <span style={{color: '#00ff00'}}>{username}</span>
        }
        else if(isAdmin === true) {
            return <span style={{color: '#ffba3c'}}>{username}</span>
        }
        else if(isConfirmed === true) {
            return <span style={{color: '#0000ff'}}>{username}</span>
        }
        else {
            return <span style={{color: '#c67bff'}}>{username}</span>
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    editUser(userID) {
        window.location.replace('/admin/users/' + userID);
    }

    loading() {
        return(
            <div className="loading" hidden={this.state.loaded}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

    showContent() {
        if(this.state.loaded === true) {
            return(
                <TableContainer component={Paper} elevation={5}>
                        <Table className="table" aria-label="customized table">
                            <TableHead>
                            <TableRow style={{backgroundColor: '#f9ff9a', color: '#ffffff'}}>
                                <TableCell>AVATAR</TableCell>
                                <TableCell align="center">USERNAME</TableCell>
                                <TableCell align="center">NOME</TableCell>
                                <TableCell align="center">COGNOME</TableCell>
                                <TableCell align="center">DATA DI NASCITA</TableCell>
                                <TableCell align="center">EMAIL</TableCell>
                                <TableCell align="center">REGISTRAZIONE</TableCell>
                                <TableCell align="center">VERIFICATO</TableCell>
                                <TableCell align="center">ADMIN</TableCell>
                                <TableCell align="center">SUPER USER</TableCell>
                                <TableCell align="center">BLOCCATO</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.users.map((user) => (
                                <TableRow key={user._id}>
                                <TableCell component="th" scope="row">
                                    {<Avatar src={user.avatar} />}
                                </TableCell>
                                <TableCell align="center" style={{fontWeight: 'bold'}}>{this.formatUsername(user.username, user.isConfirmed, user.isBanned, user.isAdmin, user.isSuperUser)}</TableCell>
                                <TableCell align="center">{user.name}</TableCell>
                                <TableCell align="center">{user.surname}</TableCell>
                                <TableCell align="center">{user.dateOfBirth === undefined ? '' : user.dateOfBirth.substring(0,10).replace(/-/g, '/')}</TableCell>
                                <TableCell align="center" style={{fontStyle: 'italic'}}>{this.props.isSuperUser ? user.email : '**********' + user.email.substring(user.email.search('@'), user.email.length)}</TableCell>
                                <TableCell align="center">{user.registrationDate === undefined ? '' : user.registrationDate.substring(0,10).replace(/-/g, '/')+' '+user.registrationDate.substring(11,16)}</TableCell>
                                <TableCell align="center">{user.isConfirmed ? 'SI' : 'NO'}</TableCell>
                                <TableCell align="center">{user.isAdmin ? 'SI' : 'NO'}</TableCell>
                                <TableCell align="center">{user.isSuperUser ? 'SI' : 'NO'}</TableCell>
                                <TableCell align="center">{user.isBanned ? 'SI' : 'NO'}</TableCell>
                                <TableCell align="center">
                                    <form onSubmit={this.handleSubmit}>
                                        <IconButton 
                                            aria-label="edit" 
                                            disabled={!this.props.isSuperUser} 
                                            onClick={() => this.editUser(user._id)}
                                            color="secondary">
                                                <SettingsRoundedIcon />
                                        </IconButton>
                                    </form>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            );
        }
    }

    render() {
        return(
            <div className="allUsers__Admin" style={{padding: 8}}>
                {this.loading()}
                {this.showContent()}
                <div className="unauthorized" hidden={!this.state.unauthorized}>
                    <Alert severity="warning">Non disponi delle autorizzazioni necessarie!</Alert>
                </div>
                <div className="error" hidden={!this.state.errors}>
                    <Alert severity="error">Errore!</Alert>
                </div>
                </div>
        );
    }
}

export default AllUsers__Admin;