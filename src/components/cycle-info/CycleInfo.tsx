import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './CycleInfo.module.css';
import { Cycle, Staff, StaffRole } from '../../models/types';

interface CycleInfoProps {
  bodyOnly?: boolean;
  cycleName: string;
  cycle: Cycle;
}

const CycleInfo = (props: CycleInfoProps) => {
  const { bodyOnly, cycleName, cycle } = props;
  const formattedName = cycleName
    .split(' ')
    .slice(2)
    .join(' ');
  const trainers: string[] = [];
  cycle.staff.forEach((staff: Staff) => {
    if (staff.active && staff.role === StaffRole.TRAINER) {
      trainers.push(staff.name);
    } else if (!cycle.active && staff.role === StaffRole.TRAINER) {
      trainers.push(staff.name);
    }
  });
  const TAs: string[] = [];
  cycle.staff.forEach((staff: Staff) => {
    if (staff.active && staff.role === StaffRole.TA) {
      TAs.push(staff.name);
    } else if (!cycle.active && staff.role === StaffRole.TA) {
      TAs.push(staff.name);
    }
  });

  const infoBody = (
    <div className={styles.Body}>
      <div>
        <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
          <strong>Trainer(s): </strong>
          {trainers.join(' | ')}
        </Typography>

        <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
          <strong>TA(s): </strong>
          {TAs.join(' | ')}
        </Typography>

        <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
          <strong>Total # Associates: </strong>
          {cycle.totalNumberOfAssociates}
        </Typography>
      </div>

      <div>
        <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
          <strong>Start Date(s): </strong>
          {cycle.startDate.toDateString()}
        </Typography>

        <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
          <strong>End Date: </strong>
          {cycle.endDate ? cycle.endDate.toDateString() : 'Active'}
        </Typography>

        <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
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
        <Typography variant='h2'>{formattedName}</Typography>

        <Typography variant='h5' color='textSecondary'>
          {cycle.type}
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
