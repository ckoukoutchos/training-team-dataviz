import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { Divider, Paper, Typography } from '@material-ui/core';

import BasicTable from '../basic-table/BasicTable';
import ExpansionPanel from '../expansion-panel/ExpansionPanel';
import Legend from '../legend/Legend';

import {
  formatCalendarDate,
  formatAttendanceEvents
} from '../../shared/dataService';
import CONSTS from '../../shared/constants';
import styles from './Calendar.module.css';

interface CalendarProps {
  attendance: any[];
  endDate: string;
  startDate: string;
}

const Calendar = (props: CalendarProps) => {
  const { attendance, endDate, startDate } = props;
  const countOfEvents = {
    'Excused Absence': 0,
    'Unexcused Absence': 0,
    'Excused Late Arrival': 0,
    'Unexcused Late Arrival': 0,
    'Optional Attendance': 0
  };
  attendance.forEach((event: any) => (countOfEvents[event.type] += 1));

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h4'>Attendance</Typography>
        <Typography variant='subtitle1' color='textSecondary'>
          Absences & Late Arrivals
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Graph}>
        <ResponsiveCalendar
          data={formatAttendanceEvents(attendance)}
          from={formatCalendarDate(startDate)}
          to={formatCalendarDate(endDate)}
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

      <ExpansionPanel panelTitle='Show Details'>
        <BasicTable
          headers={CONSTS.attendance}
          rows={Object.values(countOfEvents)}
        />
      </ExpansionPanel>
    </Paper>
  );
};

export default Calendar;
