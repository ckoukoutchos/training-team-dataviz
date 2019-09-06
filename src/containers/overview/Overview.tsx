import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { History } from 'history';

import { AppState } from '../../redux/reducers/rootReducer';
import { ActionTypes } from '../../redux/actionTypes';
import { fetchAllCyclesMetrics } from '../../redux/actions';
import {
  Cycle,
  CycleAggregation,
  Aggregation,
  Associate
} from '../../models/types';
import CONSTS from '../../shared/constants';

import CycleInfo from '../../components/cycle-info/CycleInfo';
import ExpansionPanel from '../../components/expansion-panel/ExpansionPanel';
import TraditionalCycleProgress from '../../components/progression/traditional-cycle-progess/TraditionalCycleProgress';
import TrainingInfo from '../../components/training-info/TrainingInfo';
import MLCycleProgress from '../../components/progression/ml-cycle-progress/MLCycleProgress';
import {
  Paper,
  Tabs,
  Tab,
  Button,
  Typography,
  Tooltip
} from '@material-ui/core';
import { Autorenew, Person, HelpOutline } from '@material-ui/icons';
import MaterialTable, { MTableToolbar } from 'material-table';
import styles from './Overview.module.css';

interface OverviewProps {
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  history: History;
  lookup: any;
  fetchAllCycles: () => ActionTypes;
}

interface OverviewState {
  activeTab: number;
}

class Overview extends Component<OverviewProps, OverviewState> {
  state = {
    activeTab: 0
  };

  componentDidMount() {
    if (!this.props.cycles.length) {
      this.props.fetchAllCycles();
    }
  }

  onTabChange = (event: any, value: number) => {
    this.setState({ activeTab: value });
  };

  render() {
    const { cycles, cycleAggregations, history, lookup } = this.props;
    const { activeTab } = this.state;

    const associates = cycles.reduce(
      (acc: any, curr: Cycle) => acc.concat(curr.associates),
      []
    );
    const associateAggregations = cycleAggregations.reduce(
      (acc: any, curr: CycleAggregation) => acc.concat(curr.aggregations),
      []
    );
    let watchedAssociates = associateAggregations.filter(
      (aggregation: Aggregation) => {
        const associate = associates.find(
          (associate: Associate) => associate.name === aggregation.name
        );
        const ml = associate.cycle[0] === 'm';
        const assessmentThreshold = ml ? 75 : 70;
        if (ml) {
          return (
            associate.active &&
            (aggregation.assessments < assessmentThreshold ||
              aggregation.attendance < 85 ||
              // @ts-ignore
              aggregation.moduleTime < 70)
          );
        } else {
          return (
            associate.active &&
            (aggregation.assessments < assessmentThreshold ||
              aggregation.attendance < 85)
          );
        }
      }
    );

    watchedAssociates = watchedAssociates.sort(
      (a: Aggregation, b: Aggregation) => a.composite - b.composite
    );

    const cycleProgressions = cycles.map((cycle: Cycle, index: number) => {
      if (cycle.type !== 'Mastery Learning' && cycle.active) {
        return (
          <TraditionalCycleProgress
            item={cycle}
            key={index}
            subtitle={cycle.type}
            tall
            title={CONSTS[cycle.name]}
          >
            <ExpansionPanel>
              <CycleInfo bodyOnly cycle={cycle} cycleName={cycle.name} />
            </ExpansionPanel>
          </TraditionalCycleProgress>
        );
      } else if (cycle.active) {
        return (
          <MLCycleProgress
            cycle={cycle}
            key={index}
            subtitle={cycle.type}
            title={CONSTS[cycle.name]}
          >
            <ExpansionPanel>
              <CycleInfo bodyOnly cycle={cycle} cycleName={cycle.name} />
            </ExpansionPanel>
          </MLCycleProgress>
        );
      }
    });

    return (
      <>
        <TrainingInfo cycles={cycles} />

        <Paper style={{ margin: '16px auto', width: '800px' }}>
          <Tabs
            value={activeTab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.onTabChange}
            variant='fullWidth'
          >
            <Tab label='Cycles' icon={<Autorenew />} />
            <Tab label='Associates' icon={<Person />} />
          </Tabs>
        </Paper>

        {activeTab === 0 && cycleProgressions}

        {activeTab === 1 && (
          <div className={styles.Paper}>
            <MaterialTable
              columns={[
                {
                  title: 'Associate',
                  field: 'name',
                  filtering: false,
                  render: rowData => (
                    <Button
                      color='primary'
                      onClick={() =>
                        history.push(
                          `/cycle/${
                            CONSTS[rowData.cycle]
                          }/associate/${rowData.name.split(' ').join('-')}`
                        )
                      }
                    >
                      {rowData.name}
                    </Button>
                  )
                },
                { title: 'Cycle', field: 'cycle' },
                {
                  title: 'Assessments',
                  field: 'assessments',
                  filtering: false,
                  customSort: (a: any, b: any) =>
                    a.assessments.split('%')[0] - b.assessments.split('%')[0]
                },
                {
                  title: 'Attendance',
                  field: 'attendance',
                  filtering: false,
                  customSort: (a: any, b: any) =>
                    a.attendance.split('%')[0] - b.attendance.split('%')[0]
                },
                {
                  title: 'Module Time',
                  field: 'moduleTime',
                  filtering: false,
                  customSort: (a: any, b: any) =>
                    a.moduleTime.split('%')[0] - b.moduleTime.split('%')[0]
                }
              ]}
              data={watchedAssociates.map((aggregation: CycleAggregation) => ({
                name: aggregation.name,
                cycle: CONSTS[aggregation.cycle],
                assessments: `${aggregation.assessments}%`,
                attendance: `${aggregation.attendance}%`,
                moduleTime: aggregation.moduleTime
                  ? `${aggregation.moduleTime}%`
                  : 'N/A'
              }))}
              options={{
                sorting: true,
                filtering: true,
                pageSize: 10,
                pageSizeOptions: [10, 20, 50],
                showTitle: false,
                rowStyle: (rowData: any) => {
                  const current = watchedAssociates.find(
                    (associate: Associate) => rowData.name === associate.name
                  );
                  let color = 'rgba(255, 217, 0, 0.2)';
                  if (current.composite === 1) {
                    color = 'rgba(255, 0, 0, 0.2)';
                  } else if (current.composite === 2) {
                    color = 'rgba(255, 136, 0, 0.2)';
                  }
                  return {
                    backgroundColor: color
                  };
                }
              }}
              components={{
                Toolbar: props => (
                  <div className={styles.Rows}>
                    <div
                      style={{
                        margin: '16px',
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Typography variant='h5'>Associates on Watch</Typography>
                      <Tooltip
                        className={styles.Tooltip}
                        title={
                          <>
                            <Typography>Thresholds:</Typography>
                            <ul>
                              <li>
                                <Typography>
                                  Assessments: 70% Traditional, 75% Mastery
                                  Learning
                                </Typography>
                              </li>
                              <li>
                                <Typography>Attendance: 85%</Typography>
                              </li>
                              <li>
                                <Typography>
                                  Module Time (Mastery Learning): 70%
                                </Typography>
                              </li>
                            </ul>
                            <Typography>Colors:</Typography>
                            <ul>
                              <li>
                                <Typography>Yellow: composite of 3</Typography>
                              </li>
                              <li>
                                <Typography>Orange: composite of 2</Typography>
                              </li>
                              <li>
                                <Typography>Red: composite of 1</Typography>
                              </li>
                            </ul>
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
        )}
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  cycleAggregations: state.metrics.cycleAggregations,
  cycles: state.metrics.cycles,
  lookup: state.metadata.cycleNameLookup
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchAllCycles: () => dispatch(fetchAllCyclesMetrics())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
