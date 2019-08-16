import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import styles from './Breadcrumbs.module.css';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/rootReducer';

interface BreadcrumbsProps {
  path: string;
  root: string;
  lookup: any;
}

const breadcrumbs = (props: BreadcrumbsProps) => {
  const { path, root, lookup } = props;

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
            {lookup[path[2]]}
          </Link>
          <Typography color='textPrimary'>{path[4]}</Typography>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs separator='›' aria-label='Breadcrumb'>
          <Link to={`/${root}`} className={styles.Link}>
            {root === 'cycle' ? 'Cycles' : 'Assessments'}
          </Link>

          <Typography color='textPrimary'>
            {root === 'cycle' ? lookup[path[2]] : path[3]}
          </Typography>
        </Breadcrumbs>
      )}
    </Paper>
  );
};

const mapStateToProps = (state: AppState) => ({
  lookup: state.metadata.cycleNameLookup
});

export default connect(mapStateToProps)(breadcrumbs);
