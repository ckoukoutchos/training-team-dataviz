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
  tall?: boolean;
  title: string;
  subtitle?: string;
}

class TraditionalCycleProgress extends Component<
  TraditionalCycleProgressProps
> {
  createTradCycleGraph(item: Associate | Cycle) {
    let weeksSinceStart = 0;
    if (item.endDate) {
      weeksSinceStart = calcDaysSince(item.startDate, item.endDate) / 7;
    } else {
      weeksSinceStart = calcDaysSince(item.startDate) / 7;
    }

    return (
      <div className={styles.Graph}>
        <ResponsiveBullet
          data={[
            {
              id: '',
              ranges: [3, 4, 10, 15, 18, 20],
              measures: [weeksSinceStart.toFixed(1)],
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
    const { children, item, title, subtitle, tall } = this.props;

    return (
      <Paper className={tall ? styles.TallPaper : styles.Paper}>
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
