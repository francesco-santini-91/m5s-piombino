import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import Poll from './poll';
import './admin.css';

class AllPolls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            noResults: false,
            total: null,
            page: null,
            polls: []
        }
        this.loading = this.loading.bind(this);
        this.showContent = this.showContent.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        
    }

    async componentDidMount() {
        await fetch('http://localhost:4000/server/polls/allPolls' + this.props.location.search)
        .then(response => response.json())
        .then((data) => this.setState({polls: data}))
        .catch(console.log);
        await fetch('http://localhost:4000/server/polls/numberOfAllPolls')
        .then(response => response.json())
        .then((data) => this.setState({total: data.totalPolls}))
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
        if(this.state.polls.length === 0 && this.state.loaded === true) {
            return(
                <div className="noResults">
                    <Alert severity="warning">Non ci sono sondaggi</Alert>
                </div>
            );
        }
        else {
            let listOfPolls = [];
            for(let poll of this.state.polls) {
                listOfPolls.push(<Poll
                                    key={poll._id}
                                    pollID={poll._id}
                                    title={poll.title}
                                    author={poll.author}
                                    data={poll.data}
                                    content={poll.content}
                                    isActive={poll.isActive}
                                    voters={poll.voters.length}
                                    token={this.props.token}
                                    username={this.props.username}
                                    isBanned={this.props.isBanned}
                                    isAdmin={this.props.isAdmin}
                                    isSuperUser={this.props.isSuperUser}
                                />);
            }
            return listOfPolls;
        }
    }

    handlePageChange(event, value) {
        this.setState({page: value});
        window.location.replace('/admin/allPolls?page='+value);
    }

    render() {
        return(
            <div className="allPolls">
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

export default AllPolls;