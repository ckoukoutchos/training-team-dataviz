import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './TrainingInfo.module.css';
import { Cycle } from '../../models/types';

interface TrainingInfoProps {
  cycles: Cycle[];
}

const TrainingInfo = (props: TrainingInfoProps) => {
  const { cycles } = props;

  let staffCount = 0;
  let associateCount = 0;
  let activeCycles = 0;

  for (const cycle of cycles) {
    // staffCount += cycle.TAs.length + cycle.trainers.length;
    associateCount += cycle.currentNumberOfAssociates;
    if (cycle.active) activeCycles++;
  }

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>Catalyte Training</Typography>

        <Typography variant='h6' color='textSecondary'>
          Active Cycle Overview
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Body}>
        <div>
          <Typography variant='body2'>
            <strong>Active Associates: </strong>
            {associateCount}
          </Typography>

          <Typography variant='body2'>
            <strong>Active Staff: </strong>
            {staffCount}
          </Typography>
        </div>

        <div>
          <Typography variant='body2'>
            <strong>Active Cycles: </strong>
            {activeCycles}
          </Typography>

          <Typography variant='body2'>
            <strong>Cycle Locations: </strong>
            {activeCycles}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default TrainingInfo;
