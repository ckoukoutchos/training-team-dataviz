import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppBar, IconButton, Typography, Toolbar } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import Sidedrawer from '../sidedrawer/Sidedrawer';
import { AppState } from '../../redux/reducers/rootReducer';
import SignInButton from '../auth/SignInButton';
import SignOutButton from '../auth/SignOutButton';
import styles from './NavBar.module.css';

interface NavBarState {
  sideDrawerOpen: boolean;
}

class NavBar extends Component<any, NavBarState> {
  state = {
    sideDrawerOpen: false
  };

  clickHandler = () => {
    this.setState((prevState: NavBarState) => ({
      sideDrawerOpen: !prevState.sideDrawerOpen
    }));
  };

  render() {
    const { isSignedIn } = this.props;
    const { sideDrawerOpen } = this.state;

    return (
      <>
        <div style={{ flexGrow: 1 }}>
          <AppBar
            position='fixed'
            className={sideDrawerOpen ? styles.AppBarShift : styles.AppBar}
          >
            <Toolbar>
              <IconButton
                className={sideDrawerOpen ? styles.Hide : styles.Icon}
                edge='start'
                color='inherit'
                aria-label='Menu'
                onClick={this.clickHandler}
              >
                <Menu />
              </IconButton>

              <Typography variant='h6' style={{ flexGrow: 1 }}>
                Training Team DataViz <small>Beta</small>
              </Typography>

              <div className={styles.Space}>
                <div className={isSignedIn ? '' : styles.Hide}>
                  <SignOutButton />
                </div>

                <div className={isSignedIn ? styles.Hide : ''}>
                  <SignInButton />
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </div>

        <Sidedrawer
          open={sideDrawerOpen && isSignedIn}
          onClose={this.clickHandler}
        />
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isSignedIn: state.user.isSignedIn
});

export default withRouter(connect(mapStateToProps)(NavBar));
