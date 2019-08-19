import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Typography, Button, Paper } from '@material-ui/core';

import { AppState } from '../../redux/reducers/rootReducer';
import { ActionTypes } from '../../redux/actionTypes';
import { fetchAllCyclesMetrics } from '../../redux/actions';
import {
  calcPercentiles,
  formatPercentile,
  getItemInArrayByName
} from '../../shared/dataService';
import styles from './Cycles.module.css';
import CONSTS from '../../shared/constants';
import { CycleAggregation, Cycle } from '../../models/types';

import CycleInfo from '../../components/cycle-info/CycleInfo';
import Toggle from '../../components/toggle/Toggle';

interface CyclesProps {
  allCycleAggregations: any;
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  lookup: any;
  history: History;
  fetchAllCycles: () => ActionTypes;
}

interface CyclesState {
  showInactive: boolean;
}

class Cycles extends Component<CyclesProps, CyclesState> {
  state = {
    showInactive: false
  };

  createTableData = (cycles: Cycle[], showInactive: boolean) => {
    const filteredCycles = cycles.filter(
      (cycle: Cycle) => !cycle.active === showInactive
    );

    return filteredCycles.map((cycle: Cycle) => ({
      name: CONSTS[cycle.name],
      type: cycle.type,
      startDate: cycle.startDate.toDateString(),
      endDate: cycle.endDate ? cycle.endDate.toDateString() : 'Active'
    }));
  };

  toggleHandler = () => {
    this.setState((prevState: CyclesState) => ({
      showInactive: !prevState.showInactive
    }));
  };

  render() {
    const {
      allCycleAggregations,
      cycleAggregations,
      cycles,
      lookup,
      history
    } = this.props;
    const { showInactive } = this.state;

    return (
      <>
        <Paper className={styles.Card}>
          <Typography variant='h2'>Cycles</Typography>
          <Typography variant='h5' color='textSecondary'>
            Look Up & Scores
          </Typography>
        </Paper>

        <div className={styles.Paper}>
          <MaterialTable
            columns={[
              {
                title: 'Cycle',
                field: 'name',
                render: rowData => (
                  <Button
                    color='primary'
                    onClick={() =>
                      history.push(`/cycle/${CONSTS[rowData.name]}`)
                    }
                  >
                    {rowData.name}
                  </Button>
                )
              },
              { title: 'Type', field: 'type' },
              { title: 'Start Date', field: 'startDate' },
              { title: 'End Date', field: 'endDate' }
            ]}
            data={this.createTableData(cycles, showInactive)}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50],
              showTitle: false
            }}
            components={{
              Toolbar: props => (
                <div className={styles.Rows}>
                  <div className={styles.Toggle}>
                    <Toggle
                      checked={showInactive}
                      onChange={this.toggleHandler}
                      leftLabel='Active'
                      rightLabel='Inactive'
                    />
                  </div>
                  <MTableToolbar {...props} />
                </div>
              )
            }}
            detailPanel={[
              {
                tooltip: 'Show Details',
                render: rowData => {
                  const cycle = getItemInArrayByName(
                    cycles,
                    CONSTS[rowData.name]
                  );
                  return (
                    <CycleInfo
                      bodyOnly
                      cycleName={rowData.name}
                      cycle={cycle}
                    />
                  );
                }
              }
            ]}
          />
        </div>

        <div className={styles.Paper}>
          <MaterialTable
            title='Cycle Assessment Average & Percentile'
            columns={[
              { title: 'Cycle', field: 'name' },
              { title: 'Projects', field: 'projectAvg' },
              { title: 'Quizzes', field: 'quizAvg' },
              { title: 'Soft Skills', field: 'softSkillsAvg' }
            ]}
            data={cycleAggregations.map((aggregation: CycleAggregation) => ({
              name: lookup[aggregation.name],
              projectAvg: `${aggregation.projects}% / ${formatPercentile(
                calcPercentiles(
                  allCycleAggregations.projectScores,
                  aggregation.projects
                )
              )}`,
              quizAvg: `${aggregation.quizzes}% / ${formatPercentile(
                calcPercentiles(
                  allCycleAggregations.quizScores,
                  aggregation.quizzes
                )
              )}`,
              softSkillsAvg: `${aggregation.softSkills}% / ${formatPercentile(
                calcPercentiles(
                  allCycleAggregations.softSkillsScores,
                  aggregation.softSkills
                )
              )}`
            }))}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50]
            }}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  allCycleAggregations: state.metrics.allCycleAggregations,
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
)(Cycles);
