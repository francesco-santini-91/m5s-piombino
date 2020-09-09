import React, { Component } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';
import axios from 'axios';

class Confirm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmed: false,
            userNotFound: false,
            userAlreadyConfirmed: false,
            errors: false
        };
        this.goToLoginPage = this.goToLoginPage.bind(this);
    }

    async componentDidMount() {
        var confirmed = false;
        var userNotFound = false;
        var userAlreadyConfirmed = false;
        var _errors = false;
        await axios.get('/server/login/confirm/' + this.props.match.params.username + this.props.location.search)
            .then(function(response) {
                if(response.data.confirmed) {
                    confirmed = true;
                }
                else if(response.data.userNotFound) {
                    userNotFound = true;
                }
                else if(response.data.alreadyConfirmed) {
                    userAlreadyConfirmed = true;
                }
            })
            .catch(function(errors) {
                _errors = true;
            });
            this.setState({
                confirmed: confirmed,
                userNotFound: userNotFound,
                userAlreadyConfirmed: userAlreadyConfirmed,
                errors: _errors
            });
    }

    goToLoginPage() {
        window.location.replace('/login');
    }

    render() {
        return(
            <div className="Confirm" style={{padding: '8px'}}>
                <br />
                <br />
                <div hidden={!this.state.errors}>
                    <Alert variant="filled" severity="error" closeText='close'>
                        Errore!
                    </Alert>
                </div>
                <div hidden={!this.state.userNotFound}>
                    <Alert variant="filled" severity="warning" closeText='close'>
                        Utente non trovato!
                    </Alert>
                </div>
                <div hidden={!this.state.userAlreadyConfirmed}>
                    <Alert variant="filled" severity="info" closeText='close'>
                        Account utente già confermato.
                    </Alert>     
                </div>  
                <div hidden={!this.state.confirmed}>
                    <Alert variant="filled" severity="success" closeText='close'>
                        Account utente confermato!
                    </Alert>     
                    <br />
                    <Button 
                        variant="contained" 
                        size='large' 
                        className="SendButton" 
                        onClick={this.goToLoginPage}
                        >ACCEDI
                    </Button>
                </div>
            </div>
        );
    }
 
}

export default Confirm;