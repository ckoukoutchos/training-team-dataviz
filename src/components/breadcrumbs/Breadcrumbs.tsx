import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import CONSTS from '../../shared/constants';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
  path: string;
  root: string;
}

const breadcrumbs = (props: BreadcrumbsProps) => {
  const { path, root } = props;

  return (
    <Paper
      className={
        path.length === 5 ? styles.BreadcrumbsLong : styles.BreadcrumbsShort
      }
    >
      {path.length === 5 ? (
        <Breadcrumbs separator='›' aria-label='Breadcrumb'>
          <Link to={`/${root}`} className={styles.Link}>
            Cycles
          </Link>
          <Link to={`/${root}/${path[2]}`} className={styles.Link}>
            {CONSTS[path[2]]}
          </Link>
          <Typography color='textPrimary'>{path[4]}</Typography>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs separator='›' aria-label='Breadcrumb'>
          <Link to={`/${root}`} className={styles.Link}>
            {root === 'cycle' ? 'Cycles' : 'Assessments'}
          </Link>

          <Typography color='textPrimary'>
            {root === 'cycle' ? CONSTS[path[2]] : path[3]}
          </Typography>
        </Breadcrumbs>
      )}
    </Paper>
  );
};

export default breadcrumbs;
