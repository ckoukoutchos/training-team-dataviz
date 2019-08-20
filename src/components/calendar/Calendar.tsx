import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { Divider, Paper, Typography } from '@material-ui/core';

import BasicTable from '../basic-table/BasicTable';
import ExpansionPanel from '../expansion-panel/ExpansionPanel';
import Legend from '../legend/Legend';

import { formatAttendanceEvents } from '../../shared/dataService';
import CONSTS from '../../shared/constants';
import styles from './Calendar.module.css';
import { Attendance } from '../../models/types';

interface CalendarProps {
  attendance: Attendance;
  endDate: Date | null;
  startDate: Date;
}

const Calendar = (props: CalendarProps) => {
  const { attendance, endDate, startDate } = props;

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>Attendance</Typography>
        <Typography variant='h6' color='textSecondary'>
          Absences & Late Arrivals
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Graph}>
        <ResponsiveCalendar
          data={formatAttendanceEvents(attendance.events)}
          from={startDate.toISOString()}
          to={
            endDate
              ? endDate.toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }
          emptyColor='#eeeeee'
          colors={CONSTS.attendanceColors}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          yearSpacing={40}
          monthBorderColor='#0c0314'
          dayBorderWidth={2}
          dayBorderColor='#ffffff'
          minValue={0}
          maxValue={4}
          tooltip={({ day, value = 0 }) => (
            <strong>
              {day}: {CONSTS.attendance[value]}
            </strong>
          )}
        />
      </div>

      <Legend items={CONSTS.attendance} colors={'attendanceColors'} />

      <ExpansionPanel>
        <BasicTable
          headers={CONSTS.attendance}
          rows={Object.values(attendance.count)}
        />
      </ExpansionPanel>
    </Paper>
  );
};

export default Calendar;
