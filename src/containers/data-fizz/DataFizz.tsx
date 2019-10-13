import React, { Component } from 'react';
import {
  MenuItem,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Tooltip
} from '@material-ui/core';
import styles from './DataFizz.module.css';
import { ResponsiveLine } from '@nivo/line';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/rootReducer';
import { Cycle, Module, Associate } from '../../models/types';
import { combineScores, calcScoreAvg } from '../../shared/dataService';
import MaterialTable, { MTableToolbar } from 'material-table';
import { HelpOutline } from '@material-ui/icons';

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
    const moduleAvg =
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
    const moduleData: any = [];
    weekCounts.forEach((value: number, key: number) =>
      moduleData.push({ x: key, y: value })
    );
    moduleData.sort((a: any, b: any) => a.x - b.x);

    const mlGrads = mlAssociates.filter(
      (associate: Associate) =>
        associate.exitReason && associate.exitReason.includes('rad')
    );
    const gradAvg = calcScoreAvg(combineScores(mlGrads, 'daysInCycle')) / 7;
    const weekCountsGrad = new Map();
    mlGrads.forEach((associate: Associate) => {
      const weeks = Math.round(associate.daysInCycle / 7);
      if (weekCountsGrad.has(weeks)) {
        weekCountsGrad.set(weeks, weekCountsGrad.get(weeks) + 1);
      } else {
        weekCountsGrad.set(weeks, 1);
      }
    });
    const cycleLengthData: any = [];
    weekCountsGrad.forEach((value: number, key: number) =>
      cycleLengthData.push({ x: key, y: value })
    );
    cycleLengthData.sort((a: any, b: any) => a.x - b.x);

    const tradModuleDays = [25.2, 16.8, 42, 33.6];

    const toughOnes: any = [
      'JavaScript_Form_Validation_Project_v2',
      'Garden_Center_API_Project_v5',
      'Garden_Center_Front_End_Project_v2'
    ];
    const easyOnes: any = [
      'HTML_CSS_Page_Match_Project_v2',
      'PostgreSQL_Database_Project_v3',
      'Redux_Garden_Center_Front_End_Project_v2'
    ];

    const ELOScores: any = [];

    mlAssociates.forEach((associate: Associate) => {
      let associateELO = 1500;
      let wins = 0;
      let losses = 0;
      const assignments = [
        ...associate.projects,
        ...associate.exercises,
        ...associate.quizzes
      ];
      assignments.forEach((assignment: any) => {
        let actual = 0;
        let opponent = 1500;
        if (assignment['Interaction Type']) {
          actual =
            assignment.Score === 'Pass' || assignment.Score === 'Completed'
              ? 1
              : 0;
          actual === 1 ? wins++ : losses++;
        } else if (assignment.type === 'Quiz') {
          actual = assignment.score >= 80 ? 1 : 0;
          actual === 1 ? wins++ : losses++;
        } else {
          actual = assignment.score >= 90 ? 1 : 0;
          actual === 1 ? wins++ : losses++;
          if (toughOnes.includes(assignment.name)) {
            opponent = 1550;
          } else if (easyOnes.includes(assignment.name)) {
            opponent = 1450;
          }
        }
        const expected =
          1 / (1 + Math.pow(10, (opponent - associateELO) / 400));
        associateELO = associateELO + 20 * (actual - expected);
      });

      associate.modules.forEach((modules: Module, index: number) => {
        let actual = 0;
        let opponent = 1400;
        if (modules.startDate && modules.endDate && index < 4) {
          const modulePercent = Math.round(
            (tradModuleDays[index] / modules.daysInModule) * 100
          );
          actual = modulePercent >= 60 ? 1 : 0;
          actual === 1 ? wins++ : losses++;

          if (modulePercent >= 40 && modulePercent < 50) {
            opponent = 1200;
          } else if (modulePercent >= 50 && modulePercent < 60) {
            opponent = 1300;
          } else if (modulePercent >= 70 && modulePercent < 80) {
            opponent = 1500;
          } else if (modulePercent >= 80 && modulePercent < 90) {
            opponent = 1600;
          } else if (modulePercent >= 90 && modulePercent < 100) {
            opponent = 1700;
          } else if (modulePercent > 100) {
            opponent = 1800;
          }

          const expected =
            1 / (1 + Math.pow(10, (opponent - associateELO) / 400));
          associateELO = associateELO + 20 * (actual - expected);
        }
      });

      ELOScores.push({
        name: associate.name,
        elo: Math.round(associateELO),
        wins,
        losses
      });
    });

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
              {moduleAvg.toFixed(1)} weeks
            </Typography>
          </div>

          <div className={styles.GraphPaper}>
            <ResponsiveLine
              data={[
                {
                  id: this.state.selectedModule,
                  data: [{ x: 0, y: 0 }, ...moduleData]
                }
              ]}
              margin={{ top: 30, right: 30, bottom: 100, left: 70 }}
              markers={[
                {
                  axis: 'x',
                  value: moduleAvg,
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

        <Paper style={{ margin: '16px auto', width: '800px' }}>
          <div className={styles.Header}>
            <Typography variant='h3'>Graduation Time</Typography>
            <Typography variant='h6' color='textSecondary'>
              Weeks Til Graduation for Mastery Learning
            </Typography>
          </div>

          <div className={styles.Divider}>
            <Divider />
          </div>

          <div className={styles.GraphPaper}>
            <ResponsiveLine
              data={[
                {
                  id: 'Graduated',
                  data: cycleLengthData
                }
              ]}
              margin={{ top: 30, right: 30, bottom: 100, left: 70 }}
              markers={[
                {
                  axis: 'x',
                  value: gradAvg,
                  lineStyle: { stroke: 'black', strokeWidth: 3 }
                }
              ]}
              xScale={{
                type: 'linear',
                min: 'auto',
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

        <div className={styles.Paper}>
          <MaterialTable
            columns={[
              {
                title: 'Associate',
                field: 'name',
                filtering: false
              },
              {
                title: 'ELO',
                field: 'elo',
                filtering: false
              },
              {
                title: 'Wins',
                field: 'wins',
                filtering: false
              },
              {
                title: 'Losses',
                field: 'losses',
                filtering: false
              }
            ]}
            data={ELOScores}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50],
              showTitle: false
            }}
            components={{
              Toolbar: (props: any) => (
                <div className={styles.Rows}>
                  <div
                    style={{
                      margin: '16px',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <Typography variant='h5'>ELO Scores</Typography>
                    <Tooltip
                      className={styles.Tooltip}
                      title={
                        <>
                          <Typography>
                            Ranking system assuming assignments are opponents of
                            a certain strength and passing the assignment
                            constitutes a "win" and failing a "loss". Associates
                            ELO is adjusted up or down based on wins/losses and
                            the adjustment size is relative to the opponents
                            strength.
                          </Typography>
                          <ul>
                            <li>
                              <Typography>Projects: 1600</Typography>
                            </li>
                            <li>
                              <Typography>Exercises: 1500</Typography>
                            </li>
                            <li>
                              <Typography>Quizzes: 1400</Typography>
                            </li>
                          </ul>
                          <Typography>
                            The tougher the opponent, the bigger the gain. An
                            associate with a score over 1600 would be expected
                            to pass most projects; one with a score below 1600
                            would be expected to take multiple attempts.
                          </Typography>
                        </>
                      }
                    >
                      <HelpOutline />
                    </Tooltip>
                  </div>
                  <MTableToolbar {...props} />
                </div>
              )
            }}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  cycles: state.metrics.cycles
});

export default connect(mapStateToProps)(DataFizz);
