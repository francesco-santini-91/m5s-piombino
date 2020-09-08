import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';

class Option extends Component {

    constructor(props) {
        super(props);
        this.state = {
            voted: false,
            noResults: false,
            unauthorized:false,
            errors: false
        }
        this.vote = this.vote.bind(this);
    }

    async vote() {
        if(this.props.voted === false && this.props.username !== "") {
            var voted = false;
            var unauthorized = false;
            var noResults = false;
            var _errors = false;
            await axios.post('http://localhost:4000/server/polls/' + this.props.pollID + '/vote', {
                token: this.props.token,
                optionID: this.props.id
            })
                .then(function(response) {
                    if(response.data.voted) {
                        voted = true;
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
                    voted: voted,
                    noResults: noResults,
                    unauthorized: unauthorized,
                    errors: _errors
                });
                window.location.reload();
            }
    }

    render() {
        return(
            <div className="option" style={{padding: '10px'}}>
                            <div hidden={!this.props.voted} style={{textAlign: 'left'}}>
                                {this.props.content.toUpperCase()} <span style={{marginLeft: '10px', color: 'gray'}}>{'\t ' + this.props.votesPercentile.toFixed(2) + ' %'}</span>
                                <LinearProgress color="secondary" variant="determinate" value={this.props.votesPercentile} style={{marginTop: '8px', backgroundColor: '#ffeaf1'}} />
                            </div>
                            <div hidden={this.props.voted} style={{alignSelf: 'rigth'}}>
                                <Button 
                                        variant="contained" 
                                        size='large' 
                                        className="SendButton" 
                                        onClick={this.vote}
                                        disabled={this.props.voted || !this.props.isActive || !this.props.isConfirmed}
                                        style={{height: '50px', width: '200px'}}
                                        >{this.props.content}
                                </Button>
                            </div>
                            <div className="noResults" hidden={!this.state.unauthorized}>
                                <Alert severity="warning"><a href="/profile">Conferma il tuo account</a> per votare</Alert>
                            </div>
            </div>
        );
    };
}

export default Option;