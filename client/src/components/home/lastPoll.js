import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import PollIcon from '@material-ui/icons/Poll';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import Typography from '@material-ui/core/Typography';

class LastPoll extends Component {

    render() {
        return(
            <div className="lastEvent" style={{padding: '8px'}}>
                <Card style={{margin: 'auto', width: '220px', height: '220px', backgroundColor: '#f5e2004a'}} elevation={5}>
                    <CardContent style={{marginTop: '8px'}}>
                        <Grid container spacing={0} className="lastPost" alignItems="flex-end">
                        <PollIcon style={{marginRight: '200px', color: '#ff4a4a'}} />
                            <Grid item style={{height: '20px', overflow: 'hidden'}}>
                                <Typography variant="subtitle2" style={{overflow: 'hidden'}}>
                                    {this.props.title}
                                </Typography>
                            </Grid>
                            <Grid item style={{margin: '5px'}}>
                                <div>
                                    {this.props.state === true ? <Chip size="small" label="Attivo" style={{backgroundColor: '#449c43', color: '#ffffff', width: '76px'}}/> : <Chip size="small" label="Non attivo" style={{backgroundColor: '#ef2d2d', color: '#ffffff', width: '76px'}} />}
                                </div>
                            </Grid>
                            <Grid item>
                            <a href={'/polls/'+this.props.pollID}><Avatar alt="" src={this.props.image} style={{width: 70, height: 70, backgroundColor: '#ffde857a'}}><HowToVoteIcon fontSize="large" /></Avatar></a>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="secondary" style={{marginTop: '15px'}} href={'/polls/'+this.props.pollID}>Leggi</Button>
                    </CardActions>
                    </Card>
            </div>
        );
    }
}

export default LastPoll;