import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { Divider, Paper, Typography } from '@material-ui/core';

import styles from './Graduation.module.css';
import Metadata from '../../../shared/metadata';
import { Cycle, Associate, Module } from '../../../models/types';

interface CalendarProps {
  aggregations: any;
  cycles: Cycle[];
  endDate: Date;
  startDate: Date;
}

const Graduation = (props: CalendarProps) => {
  const { aggregations, cycles, endDate, startDate } = props;

  const activeML: any = [];
  const activeTrad: any = [];
  const data: any = [];
  const tradModuleDays = [25.2, 16.8, 42, 33.6];

  cycles.forEach((cycle: Cycle) => {
    if (cycle.active) {
      cycle.type[0] !== 'M' ? activeTrad.push(cycle) : activeML.push(cycle);
    }
  });
  activeTrad.forEach((cycle: Cycle) => {
    const endDate = new Date(cycle.startDate.valueOf() + 140 * 86400000);
    data.push({
      day: endDate.toISOString().split('T')[0],
      value: cycle.currentNumberOfAssociates
    });
  });

  const mlAssociates: any = [];
  activeML.forEach((cycle: Cycle) => {
    mlAssociates.push(
      ...cycle.associates.filter((associate: Associate) => associate.active)
    );
  });

  mlAssociates.forEach((associate: Associate) => {
    const associateAgg = aggregations.find(
      (agg: any) => agg.name === associate.name
    );

    let days = 0;
    associate.modules.forEach((modules: Module, index: number) => {
      if (modules.startDate && modules.endDate) {
        days += modules.daysInModule;
      } else if (modules.startDate && !modules.endDate && index < 4) {
        if (associateAgg.moduleTime) {
          days += tradModuleDays[index] / (associateAgg.moduleTime / 100);
        }
      } else {
        days += Metadata.maxTimePerModule[index];
      }
    });

    const endDate = new Date(
      associate.startDate.valueOf() + 86400000 * (days - 5)
    );
    data.push({
      day: endDate.toISOString().split('T')[0],
      value: 1
    });
  });

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>Graduation Dates</Typography>
        <Typography variant='h6' color='textSecondary'>
          Expected Graduation Dates for Active Cycles
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Graph}>
        <ResponsiveCalendar
          data={data}
          from={startDate.toISOString()}
          to={endDate.toISOString().split('T')[0]}
          emptyColor='#eeeeee'
          colors={['lightgreen', 'limegreen', 'green', 'darkgreen']}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          yearSpacing={40}
          monthBorderColor='#0c0314'
          dayBorderWidth={2}
          dayBorderColor='#ffffff'
          minValue={0}
          maxValue='auto'
          tooltip={({ day, value = 0 }) => (
            <strong>
              {day}: {value}
            </strong>
          )}
        />
      </div>
    </Paper>
  );
};

export default Graduation;
