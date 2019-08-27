import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidedrawer.module.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {
  Assessment,
  Autorenew,
  Home,
  Person,
  SupervisorAccount
} from '@material-ui/icons';

interface SidedrawerProps {
  onClose: () => void;
  open: boolean;
}

const Sidedrawer = (props: SidedrawerProps) => {
  const { open, onClose } = props;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant='permanent'
      className={[
        styles.Drawer,
        open ? styles.DrawerOpen : styles.DrawerClosed
      ].join(' ')}
      classes={{ paper: open ? styles.DrawerOpen : styles.DrawerClosed }}
    >
      <div className={styles.ToolBar}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <Divider />

      <List>
        <Link to='/' className={styles.Link}>
          <ListItem button>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary='Overview' />
          </ListItem>
        </Link>
        <Divider />

        <Link to='/cycle' className={styles.Link}>
          <ListItem button>
            <ListItemIcon>
              <Autorenew />
            </ListItemIcon>
            <ListItemText primary='Cycles' />
          </ListItem>
        </Link>
        <Divider />

        <Link to='/associate' className={styles.Link}>
          <ListItem button>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary='Associates' />
          </ListItem>
        </Link>
        <Divider />

        <Link to='/assessment' className={styles.Link}>
          <ListItem button>
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            <ListItemText primary='Assessments' />
          </ListItem>
        </Link>
        <Divider />

        <Link to='/staff' className={styles.Link}>
          <ListItem button>
            <ListItemIcon>
              <SupervisorAccount />
            </ListItemIcon>
            <ListItemText primary='Training Staff' />
          </ListItem>
        </Link>
        <Divider />

        <Link to='/data-fizz' className={styles.Link}>
          <ListItem button>
            <ListItemIcon>
              <svg
                style={{ width: '24px', height: '24px' }}
                viewBox='0 0 24 24'
              >
                <path
                  fill='#757575'
                  d='M7,2V4H8V18A4,4 0 0,0 12,22A4,4 0 0,0 16,18V4H17V2H7M11,16C10.4,16 10,15.6 10,15C10,14.4 10.4,14 11,14C11.6,14 12,14.4 12,15C12,15.6 11.6,16 11,16M13,12C12.4,12 12,11.6 12,11C12,10.4 12.4,10 13,10C13.6,10 14,10.4 14,11C14,11.6 13.6,12 13,12M14,7H10V4H14V7Z'
                />
              </svg>
            </ListItemIcon>
            <ListItemText primary='Data Fizz' />
          </ListItem>
        </Link>
        <Divider />
      </List>
    </Drawer>
  );
};

export default Sidedrawer;
