import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import LastPost from './lastPost';
import LastEvent from './lastEvent';
import LastPoll from './lastPoll';

class LastElements extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            lastPosts: [],
            lastEvents: [],
            lastPolls: []
        }
    }

    async componentDidMount() {
        await fetch('/server/posts?page=999')
        .then(response => response.json())
        .then((data) => this.setState({lastPosts: data}))
        .catch(console.log('Errore!'));
        await fetch('/server/events/allEvents?page=999')
        .then(response => response.json())
        .then((data) => this.setState({lastEvents: data}))
        .catch(console.log('Errore!'));
        await fetch('/server/polls/allPolls?page=999')
        .then(response => response.json())
        .then((data) => this.setState({lastPolls: data}))
        .catch(console.log('Errore!'));
        this.setState({loaded: true});
    }

    showLastPosts() {
        let listOfPosts = [];
            for(let post of this.state.lastPosts) {
                listOfPosts.push(<LastPost
                                    key={post._id}
                                    title={post.title}
                                    data={post.data}
                                    image={post.image}
                                    urlTitle={post.urlTitle}
                                />);
            }
            return listOfPosts;
    }

    showLastEvents() {
        let listOfEvents = [];
            for(let event of this.state.lastEvents) {
                listOfEvents.push(<LastEvent
                                    key={event._id}
                                    title={event.title}
                                    data={event.data}
                                    image={event.image}
                                    eventID={event._id}
                                />);
            }
            return listOfEvents;
    }

    showLastPolls() {
        let listOfPolls = [];
            for(let poll of this.state.lastPolls) {
                listOfPolls.push(<LastPoll
                                    key={poll._id}
                                    title={poll.title}
                                    state={poll.isActive}
                                    pollID={poll._id}
                                />);
            }
            return listOfPolls;
    }

    render() {
        return(
            <div className="lastElements" style={{display: 'inline-flex', flexFlow: 'wrap', textAlign: '-webkit-center', justifyContent: 'center'}}>
                {this.showLastPosts()}
                <Divider />
                {this.showLastEvents()}
                <Divider />
                {this.showLastPolls()}
            </div>
        );
    }
}

export default LastElements;