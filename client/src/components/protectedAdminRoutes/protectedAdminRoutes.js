import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import user from '../../services/User';
import CircularProgress from '@material-ui/core/CircularProgress';

class protectedAdminRoutes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('t'),
            isAuthenticated: '',
            userID: '',
            username: '',
            avatar: '',
            isConfirmed: '',
            isAdmin: '',
            isSuperUser: '',
            isBanned: ''
        };
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
        const { component: Component, ...props } = this.props;
        if((this.state.isAdmin === true || this.state.isSuperUser === true) && this.state.isBanned === false) {
            return(<Route {...props} render={props => <Component {...props} userID={this.state.userID}
                                                                            username={this.state.username}
                                                                            avatar={this.state.avatar}
                                                                            token={this.state.token}
                                                                            isConfirmed={this.state.isConfirmed}
                                                                            isAdmin={this.state.isAdmin}
                                                                            isSuperUser={this.state.isSuperUser}
                                                                            isBanned={this.state.isBanned}/>} />);
        }
        else if(this.state.isAdmin === false || this.state.isBanned === true) {
            return (<Redirect to="/profile" />);
        }
        else if(this.state.isAuthenticated === false) {
            return(<Redirect to="/login" />)
        }
        else {
            return(
                <div>
                    <CircularProgress color="secondary" />
                </div>
            );
        }
        
    }
}

export default protectedAdminRoutes;