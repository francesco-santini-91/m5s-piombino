import React, { Component } from 'react';
import AppBarNotAuth from './appBarNotAuth';
import AppBarAuth from './appBarAuth';
import user from '../../services/User';
import './header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isAuthenticated: false,
          userID: '',
          username: '',
          avatar: '',
          isConfirmed: '',
          isAdmin: '',
          isSuperUser: '',
          isBanned: ''
        }
    }

async componentDidMount() {
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
  //this.forceUpdate();
}

    render() {
      if(this.state.isAuthenticated === true) {
        return(
          <AppBarAuth avatar={this.state.avatar} isConfirmed={this.state.isConfirmed} />
        );
      }
      else {
        return(
          <AppBarNotAuth />
        );
      }
    }
}

export default Header;