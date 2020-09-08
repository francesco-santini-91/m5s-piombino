import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TodayIcon from '@material-ui/icons/Today';
import Typography from '@material-ui/core/Typography';

class LastEvent extends Component {

    render() {
        return(
            <div className="lastEvent" style={{padding: '8px'}}>
                <Card style={{margin: 'auto', width: '220px', height: '220px', backgroundColor: '#f5e2004a'}} elevation={5}>
                    <CardContent style={{marginTop: '8px'}}>
                        <Grid container spacing={0} className="lastPost" alignItems="flex-end">
                        <TodayIcon style={{marginRight: '200px', color: '#ff4a4a'}}/>
                            <Grid item style={{height: '20px', overflow: 'hidden'}}>
                                <Typography variant="subtitle2" style={{overflow: 'hidden'}}>
                                    {this.props.title}
                                </Typography>
                            </Grid>
                            <Grid item style={{margin: '5px'}}>
                                <Typography color="textSecondary">
                                    {this.props.data === undefined ? '' : this.props.data.substring(0,10).replace(/-/g, '/')}
                                </Typography>
                            </Grid>
                            <Grid item>
                            <a href={'/events/'+this.props.eventID}><Avatar alt="" src={this.props.image} style={{width: 80, height: 80}} /></a>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="secondary" style={{marginTop: '15px'}} href={'/events/'+this.props.eventID}>Leggi</Button>
                    </CardActions>
                    </Card>
            </div>
        );
    }
}

export default LastEvent;