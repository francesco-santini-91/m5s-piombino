import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import Option from './option';
import user from '../../services/User';

class PollDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            pollNotFound: false,
            poll: {},
            token: localStorage.getItem('t'),
            isAuthenticated: '',
            userID: '',
            username: '',
            avatar: '',
            isConfirmed: '',
            isAdmin: '',
            isSuperUser: '',
            isBanned: '',
            alreadyVoted: null,
            noResults: false,
            unauthorized: false,
            errors: false,
        };
        this.getPollState = this.getPollState.bind(this);
        this.showOptions = this.showOptions.bind(this);
    }

    async componentDidMount() {
        await fetch('http://localhost:4000/server/polls/' + this.props.match.params.pollID)
        .then(response => response.json())
        .then((data) => this.setState({poll: data, loaded: true}))
        .catch(console.log);
        if(!this.state.poll.title) {
            this.setState({pollNotFound: true});
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
            let alreadyVoted = false;
            await axios.post('http://localhost:4000/server/polls/' + this.props.match.params.pollID, {
                token: this.state.token
            })
            .then(function(response) {
                if(response.data.alreadyVoted === true) {
                    alreadyVoted = true;
                }
            })
            .catch(function(errors) {
                console.log(errors);
            });
            this.setState({alreadyVoted: alreadyVoted});
        }
    }

    getPollState() {
        if(this.state.poll.isActive === true) {
            return (<span style={{color: 'green'}}>Attivo</span>);
        }
        else {
            return (<span style={{color: 'red'}}>Non attivo</span>);
        }
    }

    showOptions() {
        if(this.state.loaded === true) {
            if(this.state.poll.options.length === 0) {
                return(
                    <div className="noResults">
                        <Alert severity="info">Non ci sono opzioni</Alert>
                    </div>
                    );
            }
            else {
                let totalVotes = 0
                for(let option of this.state.poll.options) {
                    totalVotes = totalVotes + option.votes;
                }
                let listOfOptions = [];
                for(let option of this.state.poll.options) {
                    listOfOptions.push(<Option
                                            key={option.id}
                                            pollID={this.state.poll._id}
                                            id={option.id}
                                            content={option.name}
                                            votesPercentile={(option.votes*100)/totalVotes}
                                            voted={this.state.alreadyVoted}
                                            isActive={this.state.poll.isActive}
                                            username={this.state.username}
                                            token={this.state.token}
                                            userID={this.state.userID}
                                            isAdmin={this.state.isAdmin}
                                            isSuperUser={this.state.isSuperUser}
                                            isConfirmed={this.state.isConfirmed}
                                            isBanned={this.state.isBanned}
                                        />)
                }
                return listOfOptions;
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
            const content = EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.poll.content)));
            return(
                <div>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '1000px'}}>
                    <Grid container spacing={1} className="username" alignItems="flex-end">
                        <Grid item>
                            <Typography variant="h4" gutterBottom>
                                {this.state.poll.title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" gutterBottom>
                                Stato: {this.getPollState()}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Editor
                                editorState={content}
                                readOnly={true}
                                toolbarHidden={true}
                            />
                        </Grid>
                        <br />
                        <Grid item>
                            <div hidden={this.state.alreadyVoted}>
                                <Typography variant="body2" gutterBottom>
                                    VOTA
                                </Typography>
                            </div>
                            <div hidden={!this.state.alreadyVoted}>
                                <Typography variant="body2" gutterBottom>
                                    RISULTATI <span hidden={!this.state.poll.isActive}> PARZIALI</span>
                                </Typography>
                            </div>
                            <div hidden={this.state.poll.isActive} style={{marginBottom: '8px'}}>
                                <Alert severity="warning">Questo sondaggio non è attivo!</Alert>
                            </div>
                            <div hidden={this.state.isAuthenticated} style={{marginBottom: '8px'}}>
                                <Alert severity="warning"><a href="/login">Accedi</a> o <a href="/register">registrati</a> per votare questo sondaggio! </Alert>
                            </div>
                        </Grid>
                        <Grid item style={{textAlign: 'center'}}>
                            {this.showOptions()}
                        </Grid>
                        <Grid item>
                            <div className="success" hidden={!this.state.alreadyVoted}>
                                <Alert severity="success">Hai già votato in questo sondaggio!</Alert>
                            </div>
                            <div hidden={!this.state.isAuthenticated}>
                                <div className="notConfirmed" hidden={this.state.isConfirmed}>
                                    <Alert severity="warning"><a href="/profile">Conferma il tuo account</a> per votare!</Alert>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    </Paper>
                </div>
            );
        }
    }

    render() {
        return(
            <div className="pollDetail" style={{padding: '8px'}}>
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

export default PollDetail;