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
    if (cycle.active) {
      activeCycles++;
      associateCount += cycle.currentNumberOfAssociates;
      staffCount += cycle.staff.length;
    }
  }

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h2' gutterBottom>
          Catalyte Training
        </Typography>

        <Typography variant='h5' color='textSecondary'>
          Active Cycle Overview
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Body}>
        <div>
          <Typography variant='subtitle1'>
            <strong>Active Associates: </strong>
            {associateCount}
          </Typography>

          <Typography variant='subtitle1'>
            <strong>Active Staff: </strong>
            {staffCount}
          </Typography>
        </div>

        <div>
          <Typography variant='subtitle1'>
            <strong>Active Cycles: </strong>
            {activeCycles}
          </Typography>

          <Typography variant='subtitle1'>
            <strong>Cycle Locations: </strong>
            {activeCycles}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default TrainingInfo;
