import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import SinglePost from './singlePost';

class PostsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            noResults: false,
            total: null,
            page: null,
            posts: []
        }
        this.loading = this.loading.bind(this);
        this.showContent = this.showContent.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        
    }

    async componentDidMount() {
        await fetch('http://localhost:4000/server/posts'+this.props.location.search)
        .then(response => response.json())
        .then((data) => this.setState({posts: data}))
        .catch(console.log);
        await fetch('http://localhost:4000/server/posts/numberOfPosts')
        .then(response => response.json())
        .then((data) => this.setState({total: data.totalPosts}))
        .catch(console.log);
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
        if(this.state.posts.length === 0 && this.state.loaded === true) {
            return(
                <div className="noResults">
                    <Alert severity="warning">Non ci sono comunicati</Alert>
                </div>
            );
        }
        else {
            let listOfPosts = [];
            for(let post of this.state.posts) {
                listOfPosts.push(<SinglePost
                                    key={post._id}
                                    title={post.title}
                                    subtitle={post.subtitle}
                                    urlTitle={post.urlTitle}
                                    data={post.data}
                                    image={post.image}
                                    author={post.author}
                                    likes={post.likes.length}
                                    comments={post.comments.length}
                                />);
            }
            return listOfPosts;
        }
    }

    handlePageChange(event, value) {
        this.setState({page: value});
        window.location.replace('/posts?page='+value);
    }

    render() {
        return(
            <div className="allPosts">
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

export default PostsContainer;