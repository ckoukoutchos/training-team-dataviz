import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './CycleInfo.module.css';
import { Cycle } from '../../models/types';

interface CycleInfoProps {
  bodyOnly: boolean;
  cycleName: string;
  cycle: Cycle;
}

const CycleInfo = (props: CycleInfoProps) => {
  const { bodyOnly, cycleName, cycle } = props;

  const infoBody = (
    <div className={styles.BodyOnly}>
      <div>
        <Typography variant='body2'>
          <strong>Trainer(s): </strong>
          {cycle.trainers.join(' | ')}
        </Typography>

        <Typography variant='body2'>
          <strong>TA(s): </strong>
          {cycle.TAs.join(' | ')}
        </Typography>

        <Typography variant='body2'>
          <strong>Total # Associates: </strong>
          {cycle.totalNumberOfAssociates}
        </Typography>
      </div>

      <div>
        <Typography variant='body2'>
          <strong>Start Date(s): </strong>
          {cycle.startDate}
        </Typography>

        <Typography variant='body2'>
          <strong>End Date: </strong>
          {cycle.endDate}
        </Typography>

        <Typography variant='body2'>
          <strong>Current # Associates: </strong>
          {cycle.currentNumberOfAssociates}
        </Typography>
      </div>
    </div>
  );

  return bodyOnly ? (
    infoBody
  ) : (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>{cycleName}</Typography>

        <Typography variant='h6' color='textSecondary'>
          Mastery Learning
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      {infoBody}
    </Paper>
  );
};

export default CycleInfo;
