import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import MaterialTable from 'material-table';

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

interface CyclesProps {
  allCycleAggregations: any;
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  history: History;
  fetchAllCycles: () => ActionTypes;
}

class Cycles extends Component<CyclesProps> {
  render() {
    const {
      allCycleAggregations,
      cycleAggregations,
      cycles,
      history
    } = this.props;

    return (
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
            name: CONSTS[aggregation.name],
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
          detailPanel={[
            {
              tooltip: 'Show Details',
              render: rowData => {
                const cycle = getItemInArrayByName(
                  cycles,
                  CONSTS[rowData.name]
                );
                return (
                  <CycleInfo bodyOnly cycleName={rowData.name} cycle={cycle} />
                );
              }
            }
          ]}
          actions={[
            {
              icon: 'search',
              tooltip: 'View Cycle',
              onClick: (event, rowData) => {
                history.push(`/cycle/${CONSTS[rowData.name]}`);
              }
            }
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  allCycleAggregations: state.metrics.allCycleAggregations,
  cycleAggregations: state.metrics.cycleAggregations,
  cycles: state.metrics.cycles
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchAllCycles: () => dispatch(fetchAllCyclesMetrics())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cycles);
