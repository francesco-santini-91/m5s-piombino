import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import TabIcon from '@material-ui/icons/Tab';
import DescriptionIcon from '@material-ui/icons/Description';
import TodayIcon from '@material-ui/icons/Today';
import PollIcon from '@material-ui/icons/Poll';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './adminPanel.css'

class AdminPanel extends Component {

    constructor(props) {
        super(props);
        this.homepageTabs = this.homepageTabs.bind(this);
        this.newPost = this.newPost.bind(this);
        this.newEvent = this.newEvent.bind(this);
        this.newPoll = this.newPoll.bind(this);
        this.allPosts = this.allPosts.bind(this);
        this.allEvents = this.allEvents.bind(this);
        this.allPolls = this.allPolls.bind(this);
        this.usersList = this.usersList.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    homepageTabs() {
        window.location.replace('/admin/homepageTabs');
    }

    newPost() {
        window.location.replace('/admin/newPost');
    }

    newEvent() {
        window.location.replace('/admin/newEvent');
    }

    newPoll() {
        window.location.replace('/admin/newPoll');
    }

    allPosts() {
        window.location.replace('/admin/allPosts?page=1');
    }

    allEvents() {
        window.location.replace('/admin/allEvents?page=1');
    }

    allPolls() {
        window.location.replace('/admin/allPolls?page=1');
    }

    usersList() {
        window.location.replace('/admin/usersList');
    }

    goBack() {
        window.location.replace('/profile');
    }

    render() {
        return(
            <div className="adminPanel">
                <Grid container spacing={1} className="username" alignItems="flex-end">
                    <Grid item>
                        <Typography variant="h6">PANNELLO ADMIN</Typography> 
                    </Grid>
                    <Grid item>
                            <Button 
                                variant="contained" 
                                size='large' 
                                color='secondary'
                                className="adminButton" 
                                startIcon={<TabIcon />}
                                disabled={!this.props.isSuperUser}
                                onClick={this.homepageTabs}
                                >TABS HOMEPAGE
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                size='large' 
                                color='secondary'
                                className="adminButton" 
                                startIcon={<DescriptionIcon />}
                                disabled={!this.props.isAdmin}
                                onClick={this.newPost}
                                >Nuovo comunicato
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                size='large' 
                                color='secondary'
                                className="adminButton" 
                                startIcon={<TodayIcon />}
                                disabled={!this.props.isAdmin}
                                onClick={this.newEvent}
                                >Nuovo evento
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                size='large' 
                                color='secondary'
                                className="adminButton" 
                                startIcon={<PollIcon />}
                                disabled={!this.props.isAdmin}
                                onClick={this.newPoll}
                                >Nuovo sondaggio
                            </Button>
                        </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            size='large' 
                            color='secondary'
                            className="adminButton" 
                            startIcon={<DescriptionIcon />}
                            onClick={this.allPosts}
                            >Tutti i comunicati
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            size='large' 
                            color='secondary'
                            className="adminButton" 
                            startIcon={<TodayIcon />}
                            onClick={this.allEvents}
                            >Tutti gli eventi
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            size='large' 
                            color='secondary'
                            className="adminButton" 
                            startIcon={<PollIcon />}
                            onClick={this.allPolls}
                            >Tutti i sondaggi
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            size='large' 
                            color='secondary'
                            className="adminButton" 
                            startIcon={<PeopleAltRoundedIcon />}
                            onClick={this.usersList}
                            >Lista utenti
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button 
                            variant="contained" 
                            size='large' 
                            style={{backgroundColor: '#1c1e21', color: '#ffffff'}}
                            className="adminButton" 
                            startIcon={<ArrowBackIcon />}
                            onClick={this.goBack}
                            >INDIETRO
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default AdminPanel;