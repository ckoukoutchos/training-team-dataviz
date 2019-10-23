import React, { Component } from 'react';
import { AppBar, IconButton, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import Sidedrawer from '../sidedrawer/Sidedrawer';

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
            <Typography variant='h6' style={{ paddingTop: '8px' }}>
              Training Team DataViz
            </Typography>
          </AppBar>
        </div>

        <Sidedrawer
          open={this.state.sideDrawerOpen}
          onClose={this.clickHandler}
        />
      </>
    );
  }
}

export default NavBar;
