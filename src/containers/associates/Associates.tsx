import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import MaterialTable, { MTableToolbar } from 'material-table';

import AssociateInfo from '../../components/associate-info/AssociateInfo';
import Toggle from '../../components/toggle/Toggle';

import styles from './Associates.module.css';
import { AppState } from '../../redux/reducers/rootReducer';
import {
  CycleAggregation,
  Cycle,
  Associate
} from '../../models/types';
import {
  formatPercentile,
  calcPercentiles,
  getItemInArrayByName
} from '../../shared/dataService';

interface AssociatesProps {
  allCycleAggregations: any;
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  history: History;
}

interface AssociatesState {
  showInactive: boolean;
}

class Associates extends Component<AssociatesProps, AssociatesState> {
  state = {
    showInactive: false
  };

  createTableData = (
    allCycleAggregations: CycleAggregation,
    cycleAggregations: CycleAggregation[],
    cycles: Cycle[],
    showInactive: boolean
  ) => {
    const tableData: any = [];
    // list of only active or inactive associates
    const associates = this.filterAssociates(cycles, showInactive);
    cycleAggregations.forEach((cycleAggregation: CycleAggregation) => {
      cycleAggregation.aggregations.forEach((associate: any) => {
        // only add if in active or inactive list
        if (associates.includes(associate.name)) {
          tableData.push({
            name: associate.name,
            attemptPass: `${associate.attemptPass}% / ${formatPercentile(
              calcPercentiles(
                allCycleAggregations.attemptPassScores,
                associate.attemptPass
              )
            )}`,
            projectAvg: `${associate.projects}% / ${formatPercentile(
              calcPercentiles(
                allCycleAggregations.projectScores,
                associate.projects
              )
            )}`,
            quizAvg: `${associate.quizzes}% / ${formatPercentile(
              calcPercentiles(
                allCycleAggregations.quizScores,
                associate.quizzes
              )
            )}`,
            softSkillsAvg: `${associate.softSkills}% / ${formatPercentile(
              calcPercentiles(
                allCycleAggregations.softSkillsScores,
                associate.softSkills
              )
            )}`
          });
        }
      });
    });
    return tableData;
  };

  filterAssociates = (cycles: Cycle[], showInactive: boolean) => {
    // list of active or inactive associate names
    const associates = cycles.reduce(
      (acc: any, curr: any) => acc.concat(curr.associates),
      []
    );
    return associates.map((associate: Associate) => {
      if (!associate.active === showInactive) {
        return associate.name;
      }
    });
  };

  toggleHandler = () => {
    this.setState((prevState: AssociatesState) => ({
      showInactive: !prevState.showInactive
    }));
  };

  render() {
    const {
      allCycleAggregations,
      cycleAggregations,
      cycles,
      history
    } = this.props;
    const { showInactive } = this.state;
    const associates = cycles.reduce((acc: any, curr: any) => acc.concat(curr.associates), []);

    return (
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
            cycleAggregations,
            cycles,
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
              render: (rowData: any) => {
                return <AssociateInfo
                  bodyOnly
                  associate={getItemInArrayByName(
                    associates,
                    rowData.name
                  )}
                />
              }
            }
          ]}
          actions={[
            {
              icon: 'search',
              tooltip: 'View Associate',
              onClick: (event, rowData) => {
                const associate = getItemInArrayByName(
                  associates,
                  rowData.name
                );
                history.push(
                  `/cycle/${associate.cycle}/associate/${associate.name
                    .split(' ')
                    .join('-')}`
                );
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

export default connect(mapStateToProps)(Associates);
