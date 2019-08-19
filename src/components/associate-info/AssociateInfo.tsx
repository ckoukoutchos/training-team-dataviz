import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './AssociateInfo.module.css';
import { Associate } from '../../models/types';

interface AssociateInfoProps {
  associate: Associate;
  bodyOnly?: boolean;
  cycleName: string;
}

const AssociateInfo = (props: AssociateInfoProps) => {
  const { associate, cycleName, bodyOnly } = props;

  const infoBody = (
    <div className={styles.BodyOnly}>
      <div>
        <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
          <strong>Start Date: </strong> {associate.startDate.toDateString()}
        </Typography>

        {associate.endDate && (
          <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
            <strong>End Date: </strong>
            {associate.endDate.toDateString()}
          </Typography>
        )}
      </div>

      <div>
        <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
          <strong>Days in Cycle: </strong>
          {associate.daysInCycle}
        </Typography>

        {associate.endDate && (
          <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
            <strong>Exit Reason: </strong>
            {associate.exitReason}
          </Typography>
        )}
      </div>
    </div>
  );

  return bodyOnly ? (
    infoBody
  ) : (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h2'>{associate.name}</Typography>
        <Typography variant='h5' color='textSecondary'>
          {cycleName}
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      {infoBody}
    </Paper>
  );
};

export default AssociateInfo;
