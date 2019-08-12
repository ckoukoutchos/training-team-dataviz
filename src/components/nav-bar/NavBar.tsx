import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppBar, IconButton, Typography } from '@material-ui/core';
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
	const { isSignedIn, history } = this.props;
    return (
      <>
        <div style={{ display: 'flex' }}>
          <AppBar position='static' style={{ flexDirection: 'row' }}>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='Menu'
              style={{ margin: '0 16px' }}
              onClick={this.clickHandler}
            >
              <Menu />
            </IconButton>
			<Typography variant='h6'
				style={{ paddingTop: '8px', flexGrow: 1, cursor: 'pointer' }}
				onClick={() => history.push('/')}>
            	Training Team DataViz
            </Typography>
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

        <Sidedrawer
          open={this.state.sideDrawerOpen && isSignedIn}
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
