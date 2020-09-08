import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

class Participant extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            loaded: false,
            userNotFound: false
        }
    }

    async componentDidMount() {
        await fetch('http://localhost:4000/server/users/' + this.props.userID)
            .then(response => response.json())
            .then((data) => this.setState({user: data, loaded: true}))
            .catch(console.log);
            if(!this.state.user.username) {
                this.setState({userNotFound: true})
            }
    }

    render() {
        return(
            <div className="participant">
                 <List style={{width: '100%', maxWidth: 360}}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src={this.state.user.avatar} alt={this.props.username} />
                        </ListItemAvatar>
                        <ListItemText 
                            primary={this.state.user.username} 
                            secondary={this.state.user.name + ' ' + this.state.user.surname} 
                        />
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default Participant;