import React, { Component } from 'react';
import { AppBar, Drawer,  IconButton, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

class NavBar extends Component {
  state ={
    sideDrawerOpen: false
  }

  clickHandler = () => {
    this.setState(prevState => ({ sideDrawerOpen: !prevState.sideDrawerOpen }));
  }

  render() {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <AppBar position='static' style={{ flexDirection: 'row' }}>
            <IconButton edge='start'
              color='inherit'
              aria-label='Menu'
              style={{ margin: '0 16px' }}
              onClick={this.clickHandler}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' style={{ paddingTop: '8px' }}>Training Team DataViz</Typography>
          </AppBar>
        </div>

        <Drawer open={this.state.sideDrawerOpen} onClose={this.clickHandler}>
          <div
            style={{ width: '250px' }}
            role="presentation"
            onClick={this.clickHandler}
            onKeyDown={this.clickHandler}
          >
            <List>
              <ListItem button>
                <ListItemText primary='Overview' />
              </ListItem>
              <ListItem button>
                <ListItemText primary='Cycles' />
              </ListItem>
              <ListItem button>
                <ListItemText primary='Associates' />
              </ListItem>
              <ListItem button>
                <ListItemText primary='Upload' />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </>
    );
  }
}

export default NavBar;
