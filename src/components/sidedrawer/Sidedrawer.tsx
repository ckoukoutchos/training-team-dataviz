import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidedrawer.module.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import {
  Assessment,
  ArrowUpward,
  Autorenew,
  Home,
  Person
} from '@material-ui/icons';

interface SidedrawerProps {
  onClose: () => void;
  open: boolean;
}

const Sidedrawer = (props: SidedrawerProps) => {
  const { open, onClose } = props;

  return (
    <Drawer open={open} onClose={onClose}>
      <div
        style={{ width: '250px' }}
        role='presentation'
        onClick={onClose}
        onKeyDown={onClose}
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

          <Link to='/assessment' className={styles.Link}>
            <ListItem button>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary='Assessments' />
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidedrawer;
