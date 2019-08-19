import React, { Component } from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import { ResponsiveBullet } from '@nivo/bullet';

import Legend from '../../legend/Legend';

import { calcDaysSince } from '../../../shared/dataService';
import Metadata from '../../../shared/metadata';
import styles from './TraditionalCycleProgress.module.css';
import { Associate } from '../../../models/types';
import { Cycle } from '../../../models/types';

interface TraditionalCycleProgressProps {
  children?: any;
  item: Associate | Cycle;
  title: string;
  subtitle?: string;
}

class TraditionalCycleProgress extends Component<
  TraditionalCycleProgressProps
> {
  createTradCycleGraph(item: Associate | Cycle) {
    let daysSinceStart = 0;
    if (item.endDate) {
      daysSinceStart = Math.round(calcDaysSince(item.startDate, item.endDate));
    } else {
      daysSinceStart = Math.round(calcDaysSince(item.startDate));
    }

    return (
      <div className={styles.Graph}>
        <ResponsiveBullet
          data={[
            {
              id: '',
              ranges: [21, 28, 70, 105, 126, 140],
              measures: [daysSinceStart],
              markers: []
            }
          ]}
          margin={{ top: 20, right: 90, bottom: 50, left: 90 }}
          spacing={80}
          titleAlign='start'
          titleOffsetX={-70}
          measureSize={0.4}
          rangeColors='red_yellow_blue'
          measureColors='#e6e6e6'
          markerColors='black'
          markerSize={1}
        />
      </div>
    );
  }

  render() {
    const { children, item, title, subtitle } = this.props;

    return (
      <Paper className={styles.Paper}>
        <div className={styles.Header}>
          <Typography variant='h3'>{title}</Typography>
          {subtitle && (
            <Typography variant='h6' color='textSecondary'>
              {subtitle}
            </Typography>
          )}
        </div>

        <div className={styles.Divider}>
          <Divider />
        </div>

        {this.createTradCycleGraph(item)}

        <Legend items={Metadata.modules} colors={'moduleColors'} />

        {children}
      </Paper>
    );
  }
}

export default TraditionalCycleProgress;
