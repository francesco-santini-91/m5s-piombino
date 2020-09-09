import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import SingleEvent from './singleEvent';


class EventsContainer extends Component {
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
        await fetch('/server/events/allEvents'+this.props.location.search)
        .then(response => response.json())
        .then((data) => this.setState({events: data}))
        .catch(console.log('Errore!'));
        await fetch('/server/events/numberOfAllEvents')
        .then(response => response.json())
        .then((data) => this.setState({total: data.totalEvents}))
        .catch(console.log('Errore!'));
        this.setState({loaded: true});
    }

    loading() {
        return(
            <div className="loading" hidden={this.state.loaded}>
                <br />
                <br />
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
                listOfEvents.push(<SingleEvent
                                    key={event._id}
                                    eventID={event._id}
                                    title={event.title}
                                    image={event.image}
                                    data={event.data}
                                    location={event.location}
                                    participants={event.participants.length}
                                />);
            }
            return listOfEvents;
        }
    }

    handlePageChange(event, value) {
        this.setState({page: value});
        window.location.replace('/events?page='+value);
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

export default EventsContainer;