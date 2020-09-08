import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Badge from '@material-ui/core/Badge';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import MessageRoundedIcon from '@material-ui/icons/MessageRounded';


class SinglePost extends Component {

    render() {
        return(
            <div className="singlePost">
                <div className="root" style={{flexGrow: 1}}>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '800px'}}>
                        <Grid container spacing={1}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={1}>
                            <Grid item>
                                <ButtonBase className="image" style={{maxWidth: '100%', maxHeight: '100%'}} href={'/posts/'+this.props.urlTitle}>
                                    <img className="img" style={{margin: 'auto', display: 'block', maxWidth: '100%', maxHeight: '100%'}} alt={this.props.image} src={this.props.image} />
                                </ButtonBase>
                            </Grid>
                            <Grid item xs>
                                <Typography gutterBottom variant="h6" >
                                    {this.props.title}
                                </Typography>

                            </Grid>
                            
                            <Grid item>
                                <Typography variant="body2" color="textSecondary">
                                    Pubblicazione: {this.props.data === undefined ? '' : this.props.data.substring(0,10).replace(/-/g, '/')}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2">
                                    <a href={'/posts/'+this.props.urlTitle}>Leggi il comunicato</a>
                                </Typography>
                            </Grid>
                            </Grid>
                            <Grid item>
                                <div style={{padding: 8, margin: 10, color: '#fbc02d'}}>
                                    <Badge badgeContent={this.props.likes} color="secondary" showZero max={99}>
                                        <StarBorderRoundedIcon fontSize="large" style={{marginRight: '8px'}} /> 
                                    </Badge>
                                    {'  '}
                                    <Badge badgeContent={this.props.comments} color="secondary" showZero max={99}>
                                        <MessageRoundedIcon fontSize="large" style={{marginLeft: '8px'}} /> 
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

export default SinglePost;