import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import styles from './NavBar.module.css';
import { AppBar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { Autorenew, Home, Menu, Person } from '@material-ui/icons';
import SignInButton from '../auth/SignInButton';
import SignOutButton from '../auth/SignOutButton';

class NavBar extends Component {
  state = {
    sideDrawerOpen: false
  }

  clickHandler = () => {
    this.setState(prevState => ({ sideDrawerOpen: !prevState.sideDrawerOpen }));
  }

  render() {
	  const { isSignedIn, history } = this.props;
    return (
      <>
        <div style={{ display: 'flex' }}>
          <AppBar position='static' style={{ flexDirection: 'row' }}>
            <IconButton edge='start'
              color='inherit'
              aria-label='Menu'
              style={{ margin: '0 16px' }}
              onClick={this.clickHandler}>
              <Menu />
            </IconButton>
			<Typography variant='h6' 
				style={{ paddingTop: '8px', flexGrow: 1, cursor: 'pointer' }}
				onClick={() => history.push('/')}>Training Team DataViz</Typography>
			<div className={styles.Space}>
				<div className={ isSignedIn ? '' : styles.Hide}>
					<SignOutButton/>
				</div>
				<div className={ isSignedIn ? styles.Hide : ''}>
					<SignInButton/>
				</div>
			</div>
		  </AppBar>
        </div>

        <Drawer open={this.state.sideDrawerOpen && isSignedIn} onClose={this.clickHandler}>
          <div
            style={{ width: '250px' }}
            role="presentation"
            onClick={this.clickHandler}
            onKeyDown={this.clickHandler}
          >
            <List>
              <Link to='/' className={styles.Link}>
                <ListItem button>
                  <ListItemIcon>
                    <Home />
                  </ListItemIcon>
                  <ListItemText primary='Overview' />
                </ListItem>
              </Link>

              <Link to='/cycle' className={styles.Link}>
                <ListItem button>
                  <ListItemIcon>
                    <Autorenew />
                  </ListItemIcon>
                  <ListItemText primary='Cycles' />
                </ListItem>
              </Link>

              <Link to='/associate' className={styles.Link}>
                <ListItem button>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary='Associates' />
                </ListItem>
              </Link>
            </List>
          </div>
        </Drawer>
      </>
    );
  }
}

const mapStateToProps = state => ({
	isSignedIn: state.user.isSignedIn
});
  
export default withRouter(connect(mapStateToProps)(NavBar));
