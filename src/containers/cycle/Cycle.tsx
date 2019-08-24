import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import CycleInfo from '../../components/cycle-info/CycleInfo';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import TraditionalCycleProgress from '../../components/progression/traditional-cycle-progess/TraditionalCycleProgress';

import {
  getUrlParams,
  getItemInArrayByName,
  formatPercentile,
  calcPercentiles,
  calcScoreAvg,
  combineScores
} from '../../shared/dataService';
import styles from './Cycle.module.css';
import {
  Cycle,
  CycleAggregation,
  Aggregation,
  Associate
} from '../../models/types';
import { AppState } from '../../redux/reducers/rootReducer';
import MLCycleProgress from '../../components/progression/ml-cycle-progress/MLCycleProgress';
import AssociatesTable from '../../components/associates-table/AssociatesTable';

interface CycleProps {
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  lookup: any;
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

  calcAvgForCycleType = (
    cycleAggregations: CycleAggregation[],
    cycleName: string
  ) => {
    let filteredCycles = [];
    if (cycleName[0] === 'm') {
      filteredCycles = cycleAggregations.filter(
        (aggregation: CycleAggregation) => aggregation.name[0] === 'm'
      );
    } else {
      filteredCycles = cycleAggregations.filter(
        (aggregation: CycleAggregation) => aggregation.name[0] !== 'm'
      );
    }
    return {
      projects: calcScoreAvg(combineScores(filteredCycles, 'projects')),
      quizzes: calcScoreAvg(combineScores(filteredCycles, 'quizzes')),
      softSkills: calcScoreAvg(combineScores(filteredCycles, 'softSkills')),
      exercises: calcScoreAvg(combineScores(filteredCycles, 'exercises'))
    };
  };

  createTableData = (
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
          exerciseAvg: `${aggregation.exercises}% / ${formatPercentile(
            calcPercentiles(
              cycleAggregations.exerciseScores,
              aggregation.exercises
            )
          )}`,
          projectAvg: `${aggregation.projects}% / ${formatPercentile(
            calcPercentiles(
              cycleAggregations.projectScores,
              aggregation.projects
            )
          )}`,
          quizAvg: `${aggregation.quizzes}% / ${formatPercentile(
            calcPercentiles(cycleAggregations.quizScores, aggregation.quizzes)
          )}`,
          softSkillsAvg: `${aggregation.softSkills}% / ${formatPercentile(
            calcPercentiles(
              cycleAggregations.softSkillsScores,
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
    const { cycleAggregations, cycles, lookup, history } = this.props;
    const { url, cycle: cycleName } = getUrlParams(history);
    const cycle = getItemInArrayByName(cycles, cycleName);
    const aggregation: CycleAggregation = getItemInArrayByName(
      cycleAggregations,
      cycleName
    );
    const typeAvg = this.calcAvgForCycleType(cycleAggregations, cycleName);

    return (
      <div className={styles.Wrapper}>
        <Breadcrumbs path={url} root='cycle' />

        <CycleInfo cycleName={lookup[cycleName]} cycle={cycle} />

        <RadarGraph
          title='Assessments'
          subtitle='Project, Quiz, and Soft Skill Averages'
          index='avg'
          data={[
            {
              avg: 'Projects',
              'Cycle Average': aggregation.projects,
              [cycle.type]: typeAvg.projects
            },
            {
              avg: 'Quizzes',
              'Cycle Average': aggregation.quizzes,
              [cycle.type]: typeAvg.quizzes
            },
            {
              avg: 'Soft Skills',
              'Cycle Average': aggregation.softSkills,
              [cycle.type]: typeAvg.softSkills
            },
            {
              avg: 'Exercises',
              'Cycle Average': aggregation.exercises,
              [cycle.type]: typeAvg.exercises
            }
          ]}
          keys={['Cycle Average', cycle.type]}
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

        <AssociatesTable
          associates={cycle.associates}
          cycleAggregations={[aggregation]}
          lookup={lookup}
          history={history}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  cycleAggregations: state.metrics.cycleAggregations,
  cycles: state.metrics.cycles,
  lookup: state.metadata.cycleNameLookup
});

export default connect(mapStateToProps)(CycleView);
