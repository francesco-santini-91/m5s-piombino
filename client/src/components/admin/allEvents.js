import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import Event from './event';
import './admin.css';

class AllEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            noResults: false,
            total: null,
            page: null,
            events: []
        }
        this.loading = this.loading.bind(this);
        this.showContent = this.showContent.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        
    }

    async componentDidMount() {
        await fetch('http://localhost:4000/server/events/allEvents'+this.props.location.search)
        .then(response => response.json())
        .then((data) => this.setState({events: data}))
        .catch(console.log);
        await fetch('http://localhost:4000/server/events/numberOfAllEvents')
        .then(response => response.json())
        .then((data) => this.setState({total: data.totalEvents}))
        .catch(console.log);
        this.setState({loaded: true});
    }

    loading() {
        return(
            <div className="loading" hidden={this.state.loaded}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

    showContent() {
        if(this.state.events.length === 0 && this.state.loaded === true) {
            return(
                <div className="noResults">
                    <Alert severity="warning">Non ci sono eventi</Alert>
                </div>
            );
        }
        else {
            let listOfEvents = [];
            for(let event of this.state.events) {
                listOfEvents.push(<Event
                                    key={event._id}
                                    eventID={event._id}
                                    title={event.title}
                                    author={event.author}
                                    data={event.data}
                                    location={event.location}
                                    image={event.image}
                                    content={event.content}
                                    token={this.props.token}
                                    username={this.props.username}
                                    isBanned={this.props.isBanned}
                                    isAdmin={this.props.isAdmin}
                                    isSuperUser={this.props.isSuperUser}
                                />);
            }
            return listOfEvents;
        }
    }

    handlePageChange(event, value) {
        this.setState({page: value});
        window.location.replace('/admin/allEvents?page='+value);
    }

    render() {
        return(
            <div className="allEvents">
                {this.loading()}
                {this.showContent()}
                <div className="pagination">
                    <Pagination count={parseInt((this.state.total / 5) + 1)} 
                                page={parseInt(this.props.location.search.substring(6,9))} 
                                defaultPage={1}
                                color='secondary' 
                                onChange={this.handlePageChange} 
                                hideNextButton
                                hidePrevButton
                    />
                </div>
            </div>
        );
    }

}

export default AllEvents;