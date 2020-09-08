import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Badge from '@material-ui/core/Badge';
import PeopleRoundedIcon from '@material-ui/icons/PeopleRounded';

class SingleEvent extends Component {

    render() {
        return(
            <div className="singleEvent">
                <div className="root" style={{flexGrow: 1}}>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '800px'}}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                            <Grid item>
                                <ButtonBase className="image" style={{maxWidth: '100%', maxHeight: '100%'}} href={'/events/'+this.props.eventID}>
                                    <img className="img" style={{margin: 'auto', display: 'block', maxWidth: '100%', maxHeight: '100%'}} alt={this.props.image} src={this.props.image} />
                                </ButtonBase>
                            </Grid>
                            <Grid item xs>
                                <Typography gutterBottom variant="h6" >
                                    {this.props.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {this.props.data === undefined ? '' : this.props.data.substring(0,10).replace(/-/g, '/')}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {this.props.location}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">
                                    <a href={'/events/'+this.props.eventID}>Vai all'evento</a>
                                </Typography>
                            </Grid>
                            </Grid>
                            <Grid item>
                                <div style={{padding: 8, margin: 10, color: '#fbc02d'}}>
                                    <Badge badgeContent={this.props.participants} color="secondary" showZero max={99}>
                                        <PeopleRoundedIcon fontSize="large" style={{marginRight: '8px'}} /> 
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

export default SingleEvent;