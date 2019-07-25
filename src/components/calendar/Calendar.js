import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { Divider, Paper, Typography } from '@material-ui/core';
import { sortAttendanceEvents } from '../../shared/dataService';
import CONSTS from '../../shared/constants';
import styles from './Calendar.module.css';

const Calendar = props => {
  const attendance = sortAttendanceEvents(props.metrics);

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h4'>
          Attendance
        </Typography>
        {true ? <Typography variant='subtitle1' color='textSecondary'>
          Absences & Late Arrivals
        </Typography> : null}
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Graph}>
        <ResponsiveCalendar
          data={attendance.events}
          from={attendance['Associate Start']}
          to={attendance['Cycle Exit']}
          emptyColor="#eeeeee"
          colors={['gold', 'red', 'yellow', 'orange', 'green']}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          yearSpacing={40}
          monthBorderColor="#0c0314"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          minValue={0}
          maxValue={4}
          tooltip={({ day, value }) => (
            <strong>
              {day}: {CONSTS.attendance[value]}
            </strong>
          )}
        />
      </div>
    </Paper >
  );
}

export default Calendar;
