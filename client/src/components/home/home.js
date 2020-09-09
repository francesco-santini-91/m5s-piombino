import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LastElements from './lastElements';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import _cover from './PBovio.png';
import './home.css';


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            home: true,
            tabs: [],
            loaded: false,
            selectedTab: 0,
            t: '{"blocks":[{"key":"qv3l","text":"Testo","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":6,"length":11,"style":"BOLD"},{"offset":23,"length":6,"style":"ITALIC"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
            value: 0
        }
        this.changeTab = this.changeTab.bind(this);
    }

    async componentDidMount() {
        await fetch('/server/homepageTabs')
        .then(response => response.json())
        .then((data) => this.setState({tabs: data, loaded: true}))
        .catch(console.log('Errore!'));
    }

    changeTab(content) {
        if(content === 0) {
            this.setState({home: true});
        }
        else {
            this.setState({t: content, home: false});
        }
    }

    showTab() {
        if(this.state.home === false) {
            const content = EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.t)));
            return(
                <div>
                    <Editor
                    editorState={content}
                    readOnly={true}
                    toolbarHidden={true}
                />
                </div>
            );
        }
        else {
            return(
                <div>
                    <LastElements />
                </div>
            );
        }
    }

    showTabs() {
        let listOfTabLabels = [];
            for(let tab of this.state.tabs) {
                listOfTabLabels.push(<Button 
                                    key={tab._id}
                                    onClick={() => this.changeTab(tab.content)}
                                    style={{color: '#fcb02d'}}
                                >
                                    {tab.title}</Button>
                                );
            }
            return listOfTabLabels;
    }

    render() {       
        if(this.state.loaded === false) {
            return(
                <div className="loading" hidden={this.state.loaded}>
                    <CircularProgress color="secondary" />
                    <br />
                    <br />
                </div>
            );
        }
        else {
            return(
                <div className="home" style={{padding: 8}}>
                    <Paper className="paper" elevation={8} style={{padding: '10px', margin: 'auto', maxWidth: '800px'}}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm container>
                                <img src={_cover} alt="" style={{maxWidth: '100%'}}/>
                            </Grid>
                            <Paper square style={{justifyContent: 'space-between'}}>
                                <Button style={{color: '#fcb02d'}} onClick={() => this.changeTab(0)}>Home</Button>
                                {this.showTabs()}
                            </Paper>
                            <Grid item>
                                {this.showTab()}
                            </Grid>
                        </Grid>
                        <div style={{padding: '5px'}}>
                        <a href="https://www.facebook.com/Movimento5StellePiombino" target="_blank" rel="noopener noreferrer"><FacebookIcon size="large" style={{color: '#fcb02d', marginLeft: '5px', marginRight: '5px'}} /></a>
                        <a href="https://instagram.com/movimento5stellepiombino" target="_blank" rel="noopener noreferrer"><InstagramIcon size="large" style={{color: '#fcb02d', marginLeft: '5px', marginRight: '5px'}} /></a>
                        <a href="https://www.youtube.com/user/piombino5stelle" target="_blank" rel="noopener noreferrer"><YouTubeIcon size="large" style={{color: '#fcb02d', marginLeft: '5px', marginRight: '5px'}} /></a>
                        </div>
                    </Paper>
                    <br />
                    <Typography variant="caption" style={{color: 'ligthGray', fontSize: '9px'}}>
                        Powered by <a href="https://www.facebook.com/Santo1991" target="_blank" rel="noopener noreferrer" style={{color: 'gray'}}>Francesco Santini</a>
                    </Typography>
                </div>
            );
        }
    }
}

export default Home;