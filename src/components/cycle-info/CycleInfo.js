import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './CycleInfo.module.css';

const CycleInfo = props => {
  const { cycleName, metadata } = props;

  const nameSplit = cycleName.split(' ');
  const cycleType = nameSplit.splice(0, 2).join(' ');
  const formattedName = nameSplit.splice(-3, 3).join(' ');
  const trainers = metadata['Trainer Start'].reduce((acc, curr) => (acc + curr.name + ' | '), '').slice(0, -2);
  const TAs = metadata['TA Start'].reduce((acc, curr) => (acc + curr.name + ' | '), '').slice(0, -2);
  const startDates = metadata['Cycle Start Date'].join(' | ');
  const endDate = metadata['Cycle End Date'];
  const currentNumAssociates = metadata['Associate Leave'] ?
    metadata['Associate Start'].length - metadata['Associate Leave'].length
    : metadata['Associate Start'].length;

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>
          {formattedName}
        </Typography>

        <Typography variant='h6' color='textSecondary'>
          {cycleType}
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Body}>
        <div>
          <Typography variant='body2'>
            <strong>Trainer(s): </strong>{trainers}
          </Typography>

          <Typography variant='body2'>
            <strong>TA(s): </strong>{TAs}
          </Typography>

          <Typography variant='body2'>
            <strong>Total # Associates: </strong>{metadata['Associate Start'].length}
          </Typography>
        </div>

        <div>
          <Typography variant='body2'>
            <strong>Start Date(s): </strong>{startDates}
          </Typography>

          <Typography variant='body2'>
            <strong>End Date: </strong>{endDate}
          </Typography>

          <Typography variant='body2'>
            <strong>Current # Associates: </strong>{currentNumAssociates}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}

export default CycleInfo;