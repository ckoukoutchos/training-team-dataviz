import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import MaterialTable, { MTableToolbar } from 'material-table';

import AssociateInfo from '../../components/associate-info/AssociateInfo';
import Toggle from '../../components/toggle/Toggle';

import styles from './Associates.module.css';
import { AppState } from '../../redux/reducers/rootReducer';
import { CycleAggregation, Cycle, Associate } from '../../models/types';
import {
  formatPercentile,
  calcPercentiles,
  getItemInArrayByName
} from '../../shared/dataService';
import { Button, Typography, Paper } from '@material-ui/core';
import CONSTS from '../../shared/constants';

interface AssociatesProps {
  allCycleAggregations: any;
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  lookup: any;
  history: History;
}

interface AssociatesState {
  showInactive: boolean;
  showInactiveAggr: boolean;
  [key: string]: any;
}

class Associates extends Component<AssociatesProps, AssociatesState> {
  state = {
    showInactive: false,
    showInactiveAggr: false
  };

  createTableData = (associates: Associate[], showInactive: boolean) => {
    const filteredAssociates = associates.filter(
      (associate: Associate) => !associate.active === showInactive
    );

    return filteredAssociates.map((associate: Associate) => ({
      name: associate.name,
      cycle: CONSTS[associate.cycle],
      startDate: associate.startDate.toDateString(),
      endDate: associate.endDate ? associate.endDate.toDateString() : 'Active'
    }));
  };

  createAggrTableData = (
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

  toggleHandler = (type: string) => () => {
    this.setState((prevState: AssociatesState) => ({
      [type]: !prevState[type]
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
    const { showInactive, showInactiveAggr } = this.state;
    const associates = cycles.reduce(
      (acc: any, curr: any) => acc.concat(curr.associates),
      []
    );

    return (
      <>
        <Paper className={styles.Card}>
          <Typography variant='h2'>Associates</Typography>
          <Typography variant='h5' color='textSecondary'>
            Look Up & Scores
          </Typography>
        </Paper>

        <div className={styles.Paper}>
          <MaterialTable
            columns={[
              {
                title: 'Associate',
                field: 'name',
                render: (rowData: any) => (
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
              { title: 'Start Date', field: 'startDate', type: 'date' },
              { title: 'End Date', field: 'endDate' }
            ]}
            data={this.createTableData(associates, showInactive)}
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
                      onChange={this.toggleHandler('showInactive')}
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
                render: (rowData: any) => {
                  const associate = getItemInArrayByName(
                    associates,
                    rowData.name
                  );
                  return (
                    <AssociateInfo
                      bodyOnly
                      cycleName={lookup[associate.cycle]}
                      associate={associate}
                    />
                  );
                }
              }
            ]}
          />
        </div>

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
            data={this.createAggrTableData(
              allCycleAggregations,
              cycleAggregations,
              cycles,
              showInactiveAggr
            )}
            options={{
              sorting: true,
              pageSize: 20,
              pageSizeOptions: [10, 20, 50]
            }}
            components={{
              Toolbar: props => (
                <>
                  <MTableToolbar {...props} />
                  <Toggle
                    checked={showInactiveAggr}
                    onChange={this.toggleHandler('showInactiveAggr')}
                    leftLabel='Active'
                    rightLabel='Inactive'
                  />
                </>
              )
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

export default connect(mapStateToProps)(Associates);
