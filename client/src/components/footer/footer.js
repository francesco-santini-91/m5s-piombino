import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import TodayIcon from '@material-ui/icons/Today';
import PollIcon from '@material-ui/icons/Poll';
import './footer.css';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 9999
  },
  action: {
      color: '#fbc02d',
  }
});

function SimpleBottomNavigation() {
  const classes = useStyles();
  var tab = 0;
  switch(window.location.pathname) {
        case '/': 
            tab=0;
            break;
        case '/posts':
            tab = 1;
            break;
        case '/events':
            tab = 2;
            break;
        case '/polls':
            tab = 3;
            break;
        default:
            tab = 5;
  }
  const [value, setValue] = React.useState(tab);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        switch(newValue) {
            case 0:
                window.location.replace('/');
                break;
            case 1:
                window.location.replace('/posts?page=1');
                break;
            case 2:
                window.location.replace('/events?page=1');
                break;
            case 3:
                window.location.replace('/polls?page=1');
                break;
            default:
                window.location.replace('/');
        }
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction className={classes.action} label="Home" icon={<HomeIcon />}  />
      <BottomNavigationAction className={classes.action} label="Comunicati" icon={<DescriptionIcon />} />
      <BottomNavigationAction className={classes.action} label="Eventi" icon={<TodayIcon />} />
      <BottomNavigationAction className={classes.action} label="Sondaggi" icon={<PollIcon />} />
    </BottomNavigation>
  );
}

class Footer extends Component {

    render() {
        
        return(
            <div className="footer">
                <SimpleBottomNavigation />
            </div>
        );
    }
}

export default Footer;