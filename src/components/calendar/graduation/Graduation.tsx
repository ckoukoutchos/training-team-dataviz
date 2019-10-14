import React, { Component } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { Divider, Paper, Typography } from '@material-ui/core';

import styles from './Graduation.module.css';
import Metadata from '../../../shared/metadata';
import CONSTS from '../../../shared/constants';
import { Cycle, Associate, Module } from '../../../models/types';
import BasicTable from '../../basic-table/BasicTable';
import Legend from '../../legend/Legend';

interface GraduationProps {
  aggregations: any;
  cycles: Cycle[];
  endDate: Date;
  startDate: Date;
}

class Graduation extends Component<GraduationProps> {
  state = {
    selectedData: []
  };

  clickHandler = (date: any, data: any) => {
    if (data) {
      const selectedData = data.associates.map((associate: Associate) => [
        associate.name,
        CONSTS[associate.cycle],
        associate.cycle[0] === 'm'
          ? `Estimated: ${date.toDateString()}`
          : date.toDateString()
      ]);
      this.setState({ selectedData });
    } else {
      this.setState({ selectedData: [] });
    }
  };

  render() {
    const { aggregations, cycles, endDate, startDate } = this.props;

    const activeML: any = [];
    const activeTrad: any = [];
    const data = {};
    const tradModuleDays = [25.2, 16.8, 42, 33.6];

    cycles.forEach((cycle: Cycle) => {
      if (cycle.active) {
        cycle.type[0] !== 'M' ? activeTrad.push(cycle) : activeML.push(cycle);
      }
    });
    activeTrad.forEach((cycle: Cycle) => {
      const endDate = new Date(cycle.startDate.valueOf() + 140 * 86400000)
        .toISOString()
        .split('T')[0];
      if (data[endDate]) {
        data[endDate] = {
          type: 0,
          count: data[endDate].count + cycle.currentNumberOfAssociates,
          associates: [
            ...data[endDate].associates,
            ...cycle.associates.filter(
              (associate: Associate) => associate.active
            )
          ]
        };
      } else {
        data[endDate] = {
          type: 0,
          count: cycle.currentNumberOfAssociates,
          associates: cycle.associates.filter(
            (associate: Associate) => associate.active
          )
        };
      }
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
      )
        .toISOString()
        .split('T')[0];
      if (data[endDate]) {
        const type = data[endDate].associates.find(
          (associate: Associate) => associate.cycle[0] !== 'm'
        )
          ? 1
          : 2;
        data[endDate] = {
          type,
          count: data[endDate].count + 1,
          associates: [...data[endDate].associates, associate]
        };
      } else {
        data[endDate] = {
          type: 2,
          count: 1,
          associates: [associate]
        };
      }
    });

    const dataArray = Object.entries(data);
    const formattedData = dataArray.map((item: any) => ({
      day: item[0],
      value: item[1].type
    }));

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
            data={formattedData}
            from={startDate.toISOString()}
            to={endDate.toISOString().split('T')[0]}
            emptyColor='#eeeeee'
            colors={['#d73027', '#fdae61', '#74add1']}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor='#0c0314'
            dayBorderWidth={2}
            dayBorderColor='#ffffff'
            minValue={0}
            maxValue={2}
            tooltip={({ day, value = 0 }) => (
              <strong>
                {day}: {CONSTS.graduation[value]} {data[day].count}
              </strong>
            )}
            onClick={(day: any, event: any) =>
              this.clickHandler(day.date, data[day.day])
            }
          />
        </div>

        <Legend items={CONSTS.graduation} colors={'graduationColors'} />

        {this.state.selectedData.length > 0 && (
          <>
            <div className={styles.Divider}>
              <Divider />
            </div>

            <div style={{ margin: 'auto', width: '90%' }}>
              <BasicTable
                headers={['Name', 'Cycle', 'Date']}
                rows={this.state.selectedData}
              />
            </div>
          </>
        )}
      </Paper>
    );
  }
}

export default Graduation;
