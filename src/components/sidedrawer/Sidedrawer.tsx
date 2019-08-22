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
      </List>
    </Drawer>
  );
};

export default Sidedrawer;
