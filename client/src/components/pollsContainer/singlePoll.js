import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import HowToVoteRoundedIcon from '@material-ui/icons/HowToVoteRounded';

class SinglePoll extends Component {

    getPollState() {
        if(this.props.state === true) {
            return (<span style={{color: 'green'}}>Attivo</span>);
        }
        else {
            return (<span style={{color: 'red'}}>Non attivo</span>);
        }
    }

    render() {
        return(
            <div className="singlePoll">
                <div className="root" style={{flexGrow: 1}}>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '800px'}}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="h6" >
                                    {this.props.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Stato: {this.getPollState()}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">
                                    <a href={'/polls/'+this.props.pollID}>Vai al sondaggio</a>
                                </Typography>
                            </Grid>
                            </Grid>
                            <Grid item>
                                <div style={{padding: 8, margin: 10, color: '#fbc02d'}}>
                                    <Badge badgeContent={this.props.voters} color="secondary" showZero max={99}>
                                        <HowToVoteRoundedIcon fontSize="large" style={{marginRight: '8px'}} /> 
                                    </Badge>
                                </div>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default SinglePoll;