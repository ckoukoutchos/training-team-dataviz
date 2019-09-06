import React, { Component } from 'react';
import {
  MenuItem,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@material-ui/core';
import styles from './DataFizz.module.css';
import { ResponsiveLine } from '@nivo/line';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/rootReducer';
import { Cycle, Module, Associate } from '../../models/types';
import { combineScores, calcScoreAvg } from '../../shared/dataService';

class DataFizz extends Component<any> {
  state = {
    selectedModule: 'Development Basics and Front End'
  };

  onModuleSelection = (event: any) => {
    this.setState({ selectedModule: event.target.value });
  };

  render() {
    const mlCycles = this.props.cycles.filter(
      (cycle: Cycle) => cycle.name[0] === 'm'
    );
    const mlAssociates = mlCycles.reduce(
      (acc: Associate[], curr: Cycle) => acc.concat(curr.associates),
      []
    );
    const mlModules = mlAssociates.reduce(
      (acc: Module[], curr: Associate) => acc.concat(curr.modules),
      []
    );
    const filteredModules = mlModules.filter(
      (modules: Module) =>
        modules.type === this.state.selectedModule &&
        (modules.startDate && modules.endDate)
    );
    const avg =
      calcScoreAvg(combineScores(filteredModules, 'daysInModule')) / 7;
    const weekCounts = new Map();
    filteredModules.forEach((modules: Module) => {
      const weeks = Math.round(modules.daysInModule / 7);
      if (weekCounts.has(weeks)) {
        weekCounts.set(weeks, weekCounts.get(weeks) + 1);
      } else {
        weekCounts.set(weeks, 1);
      }
    });
    const data: any = [];
    weekCounts.forEach((value: number, key: number) =>
      data.push({ x: key, y: value })
    );
    data.sort((a: any, b: any) => a.x - b.x);

    return (
      <>
        <Paper className={styles.Paper}>
          <div className={styles.Header}>
            <Typography variant='h2' gutterBottom>
              Data Fizz
            </Typography>

            <Typography variant='h5' color='textSecondary'>
              For All the Things That Spill Over
            </Typography>
          </div>
        </Paper>

        <Paper style={{ margin: '16px auto', width: '800px' }}>
          <div className={styles.Header}>
            <Typography variant='h3'>Module Time</Typography>
            <Typography variant='h6' color='textSecondary'>
              Module Lengths for Mastery Learning
            </Typography>
          </div>

          <div className={styles.Divider}>
            <Divider />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControl style={{ minWidth: '120px', marginLeft: '32px' }}>
              <InputLabel htmlFor='module'>Module</InputLabel>
              <Select
                value={this.state.selectedModule}
                onChange={this.onModuleSelection}
                inputProps={{
                  name: 'age',
                  id: 'module'
                }}
              >
                {[
                  'Development Basics and Front End',
                  'Databases',
                  'Logic Layer (Java)',
                  'Front End Frameworks (React)'
                ].map((modules: string) => (
                  <MenuItem key={modules} value={modules}>
                    {modules}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography style={{ margin: '8px 32px 0 0' }}>
              <strong>Average: </strong>
              {avg.toFixed(1)} weeks
            </Typography>
          </div>

          <div className={styles.GraphPaper}>
            <ResponsiveLine
              data={[
                {
                  id: this.state.selectedModule,
                  data: [{ x: 0, y: 0 }, ...data]
                }
              ]}
              margin={{ top: 30, right: 30, bottom: 100, left: 70 }}
              markers={[
                {
                  axis: 'x',
                  value: avg,
                  lineStyle: { stroke: 'black', strokeWidth: 3 }
                }
              ]}
              xScale={{
                type: 'linear',
                min: 0,
                max: 'auto'
              }}
              yScale={{
                type: 'linear',
                stacked: true,
                min: 0,
                max: 'auto'
              }}
              // @ts-ignore
              curve='catmullRom'
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Weeks',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              colors={{ scheme: 'red_yellow_blue' }}
              pointSize={12}
              pointColor='white'
              pointBorderWidth={3}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabel='y'
              pointLabelYOffset={-12}
              lineWidth={3}
              enableArea={true}
              enableSlices='x'
              areaBlendMode='natural'
              areaOpacity={0.05}
              isInteractive={true}
              enableCrosshair={true}
              animate={false}
            />
          </div>
        </Paper>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  cycles: state.metrics.cycles
});

export default connect(mapStateToProps)(DataFizz);
