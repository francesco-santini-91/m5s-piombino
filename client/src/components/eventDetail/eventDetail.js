import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import Participant from './participant';
import user from '../../services/User';

class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            eventNotFound: false,
            event: {},
            token: localStorage.getItem('t'),
            isAuthenticated: '',
            userID: '',
            username: '',
            avatar: '',
            isConfirmed: '',
            isAdmin: '',
            isSuperUser: '',
            isBanned: '',
            participation: false,
            noResults: false,
            unauthorized: false,
            errors: false,
        };
        this.formatData = this.formatData.bind(this);
        this.participate = this.participate.bind(this);
        this.participants = this.participants.bind(this);
    }

    async componentDidMount() {
        await fetch('http://localhost:4000/server/events/' + this.props.match.params.eventID)
        .then(response => response.json())
        .then((data) => this.setState({event: data, loaded: true}))
        .catch(console.log);
        if(!this.state.event.title) {
            this.setState({eventNotFound: true});
        }
        var auth, userID, username, avatar, isConfirmed, isAdmin, isSuperUser, isBanned;
        var _user = new user(localStorage.getItem('t'));
        await _user.isAuthenticated().then(function(result) {
            auth = result.authorized;
            userID = result.userID;
            username = result.username;
            avatar = result.avatar;
            isConfirmed = result.isConfirmed;
            isAdmin = result.isAdmin;
            isSuperUser = result.isSuperUser;
            isBanned = result.isBanned;

        });
        this.setState({
            isAuthenticated: auth,
            userID: userID,
            username: username,
            avatar: avatar,
            isConfirmed: isConfirmed,
            isAdmin: isAdmin,
            isSuperUser: isSuperUser,
            isBanned: isBanned
        });
        if(this.state.isAuthenticated === true) {
            let participation = false;
            await axios.post('http://localhost:4000/server/events/' + this.props.match.params.eventID, {
                token: this.state.token
            })
            .then(function(response) {
                if(response.data.participation === true) {
                    participation = true;
                }
            })
            .catch(function(errors) {
                console.log(errors);
            });
            this.setState({participation: participation});
        }
    }

    formatData(data) {
        return data.substring(0,10).replace(/-/g, '/')+ ' ' + data.substring(11,16);
    }

    async participate() {
        if(this.state.participation === false && this.state.isAuthenticated === true) {
            var participation = false;
            var noResults = false;
            var _errors = false;
            await axios.post('http://localhost:4000/server/events/' + this.state.event._id + '/participate', {
                token: this.state.token
            })
                .then(function(response) {
                    if(response.data.participate) {
                        participation = true;
                    }
                    else if(response.data.noResults) {
                        noResults = true;
                    }
                })
                .catch(function(errors) {
                    console.log(errors);
                    _errors = true;
                });
                this.setState({
                    participation: participation,
                    noResults: noResults,
                    errors: _errors
                });
                window.location.reload();
            }
    }

    participants() {
        if(this.state.loaded === true) {
            if(this.state.event.noResults !== true) {
                if(this.state.event.participants.length === 0) {
                    return(
                        <div className="noResults">
                            <Alert severity="info">Non ci sono partecipanti a questo evento.</Alert>
                        </div>
                        );
                }
                else {
                    let listOfParticipants = [];
                    for(let participant of this.state.event.participants) {
                        listOfParticipants.push(<Participant
                                                key={participant._id}
                                                userID={participant._id}
                                            />)
                    }
                    return listOfParticipants;
                }
            }
        }
    }

    showContent() {
        if(this.state.loaded === false) {
            return(
                <div className="loading" hidden={this.state.loaded}>
                    <CircularProgress color="secondary" />
                    <br />
                    <br />
                </div>
            );
        }
        else if(this.state.loaded === true) {
            const content = EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.event.content)));
            return(
                <div>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '1000px'}}>
                    <Grid container spacing={1} className="username" alignItems="flex-end">
                        <Grid item>
                            <Typography variant="h4" gutterBottom>
                                {this.state.event.title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" gutterBottom>
                                {this.state.event.data === undefined ? '' : this.formatData(this.state.event.data)}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {this.state.event.location}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <img src={this.state.event.image} alt="" style={{maxWidth: '90%'}}></img>
                        </Grid>
                        <Grid item>
                            
                        </Grid>
                        <Grid item>
                            <Editor
                                editorState={content}
                                readOnly={true}
                                toolbarHidden={true}
                            />
                        </Grid>
                        <Grid item>
                            <div hidden={this.state.participation} onClick={this.participate}>
                                <Button variant="contained" color="secondary" style={{marginBottom: 15, marginTop: 15}}>
                                    Partecipa
                                </Button>
                            </div>
                            <Typography variant="body2" gutterBottom>
                                Partecipanti: {this.state.event.participants.length}
                            </Typography>
                            <div>
                                {this.participants()}
                            </div>
                            <br />
                        </Grid>
                        <Grid item>
                        <div className="success" hidden={!this.state.participation}>
                            <Alert severity="success">Parteciperai a questo evento!</Alert>
                        </div>
                        <div className="unauthorized" hidden={!this.state.unauthorized}>
                            <Alert severity="warning">Non disponi delle autorizzazioni necessarie!</Alert>
                        </div>
                        <div className="error" hidden={!this.state.errors}>
                            <Alert severity="error">Errore!</Alert>
                        </div>
                        </Grid>
                    </Grid>
                    </Paper>
                    <br />
                </div>
            );
        }
    }

    render() {
        return(
            <div className="eventDetail" style={{padding: '8px'}}>
                {this.showContent()}
            </div>
        );
    }
}

export default EventDetail;