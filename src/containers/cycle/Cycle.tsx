import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import MaterialTable, { MTableToolbar } from 'material-table';

import AssociateInfo from '../../components/associate-info/AssociateInfo';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import CycleInfo from '../../components/cycle-info/CycleInfo';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import TraditionalCycleProgress from '../../components/progression/traditional-cycle-progess/TraditionalCycleProgress';
import Toggle from '../../components/toggle/Toggle';

import {
  getUrlParams,
  getItemInArrayByName,
  formatPercentile,
  calcPercentiles
} from '../../shared/dataService';
import CONSTS from '../../shared/constants';
import styles from './Cycle.module.css';
import {
  Cycle,
  CycleAggregation,
  Aggregation,
  Associate
} from '../../models/types';
import { AppState } from '../../redux/reducers/rootReducer';
import MLCycleProgress from '../../components/progression/ml-cycle-progress/MLCycleProgress';

interface CycleProps {
  allCycleAggregations: CycleAggregation;
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  history: History;
}

interface CycleState {
  showInactive: boolean;
  [key: string]: any;
}

class CycleView extends Component<CycleProps, CycleState> {
  state = {
    showInactive: false
  };

  createTableData = (
    allCycleAggregations: CycleAggregation,
    cycleAggregations: CycleAggregation,
    cycle: Cycle,
    showInactive: boolean
  ) => {
    const tableData: any = [];
    // list of only active or inactive associates
    const associates = this.filterAssociates(cycle, showInactive);

    cycleAggregations.aggregations.forEach((aggregation: Aggregation) => {
      // only add if in active or inactive list
      if (associates.includes(aggregation.name)) {
        tableData.push({
          name: aggregation.name,
          attemptPass: `${aggregation.attemptPass}% / ${formatPercentile(
            calcPercentiles(
              allCycleAggregations.attemptPassScores,
              aggregation.attemptPass
            )
          )}`,
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
        });
      }
    });
    return tableData;
  };

  filterAssociates = (cycle: Cycle, showInactive: boolean) =>
    // list of active or inactive associate names
    cycle.associates.map((associate: Associate) => {
      if (!associate.active === showInactive) {
        return associate.name;
      }
    });

  toggleHandler = () => {
    this.setState(prevState => ({ showInactive: !prevState.showInactive }));
  };

  render() {
    const {
      allCycleAggregations,
      cycleAggregations,
      cycles,
      history
    } = this.props;
    const { showInactive } = this.state;
    const { url, cycle: cycleName } = getUrlParams(history);
    const cycle = getItemInArrayByName(cycles, cycleName);
    const aggregation = getItemInArrayByName(cycleAggregations, cycleName);

    return (
      <div className={styles.Wrapper}>
        <Breadcrumbs path={url} />

        <CycleInfo cycleName={CONSTS[cycleName]} cycle={cycle} />

        <RadarGraph
          title='Running Averages of Assessments'
          subtitle='Compared to Training Average'
          index='avg'
          data={[
            {
              avg: 'Projects',
              'Cycle Average': aggregation.projects,
              'Training Average': allCycleAggregations.projects
            },
            {
              avg: 'Quizzes',
              'Cycle Average': aggregation.quizzes,
              'Training Average': allCycleAggregations.quizzes
            },
            {
              avg: 'Soft Skills',
              'Cycle Average': aggregation.softSkills,
              'Training Average': allCycleAggregations.softSkills
            },
            {
              avg: 'Attempt/Pass',
              'Cycle Average': aggregation.attemptPass,
              'Training Average': allCycleAggregations.attemptPass
            }
          ]}
          keys={['Cycle Average', 'Training Average']}
        />

        {cycleName[0] === 'm' ? (
          <MLCycleProgress
            cycle={cycle}
            title='Cycle Progress'
            subtitle='Count per Module'
          />
        ) : (
          <TraditionalCycleProgress item={cycle} title='Cycle Progress' />
        )}

        <div className={styles.Paper}>
          <MaterialTable
            title='Associate Assessment Average & Percentile'
            columns={[
              { title: 'Associate', field: 'name' },
              { title: 'Projects', field: 'projectAvg' },
              { title: 'Quizzes', field: 'quizAvg' },
              { title: 'Soft Skills', field: 'softSkillsAvg' },
              { title: 'Attempt/Pass', field: 'attemptPass' }
            ]}
            data={this.createTableData(
              allCycleAggregations,
              aggregation,
              cycle,
              showInactive
            )}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50]
            }}
            components={{
              Toolbar: props => (
                <>
                  <MTableToolbar {...props} />
                  <Toggle
                    checked={showInactive}
                    onChange={this.toggleHandler}
                    leftLabel='Active'
                    rightLabel='Inactive'
                  />
                </>
              )
            }}
            detailPanel={[
              {
                tooltip: 'Show Details',
                render: (rowData: any) => (
                  <AssociateInfo
                    bodyOnly
                    associate={getItemInArrayByName(
                      cycle.associates,
                      rowData.name
                    )}
                  />
                )
              }
            ]}
            actions={[
              {
                icon: 'search',
                tooltip: 'View Associate',
                onClick: (event, rowData) => {
                  this.props.history.push(
                    `/cycle/${cycleName}/associate/${rowData.name
                      .split(' ')
                      .join('-')}`
                  );
                }
              }
            ]}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  allCycleAggregations: state.metrics.allCycleAggregations,
  cycleAggregations: state.metrics.cycleAggregations,
  cycles: state.metrics.cycles
});

export default connect(mapStateToProps)(CycleView);
