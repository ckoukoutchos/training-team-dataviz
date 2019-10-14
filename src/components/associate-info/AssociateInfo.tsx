import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './AssociateInfo.module.css';
import { Associate, Aggregation, Module } from '../../models/types';
import Metadata from '../../shared/metadata';

interface AssociateInfoProps {
  aggregation: Aggregation;
  associate: Associate;
  bodyOnly?: boolean;
  cycleName: string;
}

const AssociateInfo = (props: AssociateInfoProps) => {
  const { aggregation, associate, cycleName, bodyOnly } = props;

  let days = 0;
  if (!associate.endDate && associate.cycle[0] === 'm') {
    const tradModuleDays = [25.2, 16.8, 42, 33.6];
    associate.modules.forEach((modules: Module, index: number) => {
      if (modules.startDate && modules.endDate) {
        days += modules.daysInModule;
      } else if (modules.startDate && !modules.endDate && index < 4) {
        if (aggregation.moduleTime) {
          days += tradModuleDays[index] / (aggregation.moduleTime / 100);
        }
      } else {
        days += Metadata.maxTimePerModule[index];
      }
    });
  }

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

        {!associate.endDate && associate.cycle[0] !== 'm' && (
          <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
            <strong>Expected End Date: </strong>
            {new Date(
              associate.startDate.valueOf() + 138 * 86400000
            ).toDateString()}
          </Typography>
        )}

        {!associate.endDate && associate.cycle[0] === 'm' && (
          <Typography variant={bodyOnly ? 'body2' : 'subtitle1'}>
            <strong>Estimated End Date: </strong>
            {new Date(
              associate.startDate.valueOf() + 86400000 * (days - 5)
            ).toDateString()}
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
