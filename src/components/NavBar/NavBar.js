import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { AppBar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { ArrowUpward, Autorenew, Home, Menu, Person } from '@material-ui/icons';

class NavBar extends Component {
  state = {
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
              <Menu />
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

              <Link to='/upload' className={styles.Link}>
                <ListItem button>
                  <ListItemIcon>
                    <ArrowUpward />
                  </ListItemIcon>
                  <ListItemText primary='Upload' />
                </ListItem>
              </Link>
            </List>
          </div>
        </Drawer>
      </>
    );
  }
}

export default NavBar;
