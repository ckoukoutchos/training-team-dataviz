import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import CONSTS from '../../shared/constants';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
  path: string;
}

const breadcrumbs = (props: BreadcrumbsProps) => {
  const { path } = props;

  return (
    <Paper
      className={
        path.length === 5 ? styles.BreadcrumbsLong : styles.BreadcrumbsShort
      }
    >
      {path.length === 5 ? (
        <Breadcrumbs separator='›' aria-label='Breadcrumb'>
          <Link to='/cycle' className={styles.Link}>
            Cycles
          </Link>

          <Link to={'/cycle/' + path[2]} className={styles.Link}>
            {CONSTS[path[2]]}
          </Link>

          <Typography color='textPrimary'>{path[4]}</Typography>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs separator='›' aria-label='Breadcrumb'>
          <Link to='/cycle' className={styles.Link}>
            Cycles
          </Link>

          <Typography color='textPrimary'>{CONSTS[path[2]]}</Typography>
        </Breadcrumbs>
      )}
    </Paper>
  );
};

export default breadcrumbs;
