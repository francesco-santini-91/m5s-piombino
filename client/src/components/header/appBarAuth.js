import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import BarLogo from './bar-logo.png';
import './header.css';

class AppBarAuth extends Component {


    render() {
        return (
            <div className="root">
                <AppBar position="static" className="appBar">
                    <Toolbar>
                        <IconButton edge="start" className="menuButton" color="inherit" aria-label="menu" href="/login">
                            <MeetingRoomRoundedIcon fontSize="large" style={{color: '#ffffff'}} />
                        </IconButton>
                        <a href="/"><img src={BarLogo} alt ="" height='45px' width='200px'></img></a>
                        <Badge color="secondary" badgeContent="!" anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} invisible={this.props.isConfirmed}>
                            <a href="/profile"><Avatar alt={this.props.username} src={this.props.avatar} href='/profile' /></a>
                        </Badge>
                    </Toolbar>
                </AppBar>
            </div>
          );
    }
}

export default AppBarAuth;