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
import { Paper, Tabs, Tab, Button } from '@material-ui/core';
import { Autorenew, Person } from '@material-ui/icons';
import MaterialTable from 'material-table';
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
    const watchedAssociates = associateAggregations.filter(
      (aggregation: Aggregation) => {
        const associate = associates.find(
          (associate: Associate) => associate.name === aggregation.name
        );
        return aggregation.composite < 3 && associate.active;
      }
    );

    const cycleProgressions = cycles.map((cycle: Cycle, index: number) => {
      if (cycle.type !== 'Mastery Learning') {
        return (
          <TraditionalCycleProgress
            item={cycle}
            key={index}
            subtitle={cycle.type}
            title={CONSTS[cycle.name]}
          >
            <ExpansionPanel>
              <CycleInfo bodyOnly cycle={cycle} cycleName={cycle.name} />
            </ExpansionPanel>
          </TraditionalCycleProgress>
        );
      } else {
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
              title='Associates on Watch'
              columns={[
                {
                  title: 'Associate',
                  field: 'name',
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
                  customSort: (a: any, b: any) =>
                    a.assessments.split('%')[0] - b.assessments.split('%')[0]
                },
                {
                  title: 'Attendance',
                  field: 'attendance',
                  customSort: (a: any, b: any) =>
                    a.attendance.split('%')[0] - b.attendance.split('%')[0]
                },
                {
                  title: 'Module Time',
                  field: 'moduleTime',
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
                pageSize: 10,
                pageSizeOptions: [10, 20, 50],
                rowStyle: (rowData: any) => {
                  const current = watchedAssociates.find(
                    (associate: Associate) => rowData.name === associate.name
                  );
                  return {
                    backgroundColor:
                      current.composite === 1
                        ? 'rgba(255, 0, 0, 0.05)'
                        : 'rgba(255, 136, 0, 0.05)'
                  };
                }
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
