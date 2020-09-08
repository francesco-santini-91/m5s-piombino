import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BarLogo from './bar-logo.png';
import './header.css';

class AppBarNotAuth extends Component {

    render() {
        return (
            <div className="root">
              <AppBar position="static" className="appBar">
                <Toolbar>
                  <IconButton edge="start" className="menuButton" color="inherit" aria-label="logout" href="/login" alt="Logout">
                    <ExitToAppIcon style={{color: '#fbc02d'}} />
                  </IconButton>
                  <a href="/"><img src={BarLogo} alt ="" height='45px' width='200px'></img></a>
                  <Button color="inherit" href="/login">Accedi</Button>
                </Toolbar>
              </AppBar>
            </div>
          );
    }
}

export default AppBarNotAuth;