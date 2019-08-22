import React, { Component } from 'react';
import { Paper, Tabs, Tab, Button } from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import { ScatterPlot, Assessment, Person } from '@material-ui/icons';
import Toggle from '../toggle/Toggle';
import AssociateInfo from '../associate-info/AssociateInfo';
import styles from './AssociatesTable.module.css';
import { Associate, CycleAggregation, Aggregation } from '../../models/types';
import CONSTS from '../../shared/constants';
import {
  formatPercentile,
  calcPercentiles,
  getItemInArrayByName
} from '../../shared/dataService';
import { History } from 'history';

interface AssociatesTableProps {
  associates: Associate[];
  cycleAggregations: CycleAggregation[];
  lookup: any;
  history: History;
}

interface AssociatesTableState {
  activeTab: number;
  showInactive: boolean;
  showInactiveAggr: boolean;
  [key: string]: any;
}

class AssociatesTable extends Component<
  AssociatesTableProps,
  AssociatesTableState
> {
  state = {
    activeTab: 0,
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
    cycleAggregations: CycleAggregation[],
    associates: Associate[],
    showInactive: boolean
  ) => {
    const tableData: any = [];
    // list of only active or inactive associates
    const filteredAssociates = this.filterAssociates(associates, showInactive);
    cycleAggregations.forEach((cycleAggregation: CycleAggregation) => {
      cycleAggregation.aggregations.forEach((aggregation: Aggregation) => {
        // only add if in active or inactive list
        if (filteredAssociates.includes(aggregation.name)) {
          tableData.push({
            name: aggregation.name,
            combined: `${aggregation.combined}% / ${formatPercentile(
              calcPercentiles(
                cycleAggregation.combinedScores,
                aggregation.combined
              )
            )}`,
            assessments: `${aggregation.assessments}% / ${formatPercentile(
              calcPercentiles(
                cycleAggregation.assessmentsScores,
                aggregation.assessments
              )
            )}`,
            attendance: `${aggregation.attendance}% / ${formatPercentile(
              calcPercentiles(
                cycleAggregation.attendanceScores,
                aggregation.attendance
              )
            )}`,
            moduleTime: aggregation.moduleTime
              ? `${aggregation.moduleTime}% / ${formatPercentile(
                  calcPercentiles(
                    cycleAggregation.moduleTimeScores,
                    aggregation.moduleTime
                  )
                )}`
              : 'N/A'
          });
        }
      });
    });
    return tableData;
  };

  createAssessmentTableData = (
    cycleAggregations: CycleAggregation[],
    associates: Associate[],
    showInactive: boolean
  ) => {
    const tableData: any = [];
    // list of only active or inactive associates
    const filteredAssociates = this.filterAssociates(associates, showInactive);
    cycleAggregations.forEach((cycleAggregation: CycleAggregation) => {
      cycleAggregation.aggregations.forEach((aggregation: Aggregation) => {
        // only add if in active or inactive list
        if (filteredAssociates.includes(aggregation.name)) {
          tableData.push({
            name: aggregation.name,
            exerciseAvg: `${aggregation.exercises}% / ${formatPercentile(
              calcPercentiles(
                cycleAggregation.exerciseScores,
                aggregation.exercises
              )
            )}`,
            projectAvg: `${aggregation.projects}% / ${formatPercentile(
              calcPercentiles(
                cycleAggregation.projectScores,
                aggregation.projects
              )
            )}`,
            quizAvg: `${aggregation.quizzes}% / ${formatPercentile(
              calcPercentiles(cycleAggregation.quizScores, aggregation.quizzes)
            )}`,
            softSkillsAvg: `${aggregation.softSkills}% / ${formatPercentile(
              calcPercentiles(
                cycleAggregation.softSkillsScores,
                aggregation.softSkills
              )
            )}`
          });
        }
      });
    });
    return tableData;
  };

  filterAssociates = (associates: Associate[], showInactive: boolean) =>
    associates.map((associate: Associate) => {
      if (!associate.active === showInactive) {
        return associate.name;
      }
    });

  onTabChange = (event: any, value: number) => {
    this.setState({ activeTab: value });
  };

  toggleHandler = (type: string) => () => {
    this.setState((prevState: AssociatesTableState) => ({
      [type]: !prevState[type]
    }));
  };

  render() {
    const { associates, cycleAggregations, lookup, history } = this.props;
    const { activeTab, showInactive, showInactiveAggr } = this.state;

    return (
      <>
        <Paper style={{ margin: '16px auto', width: '800px' }}>
          <Tabs
            value={activeTab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.onTabChange}
            variant='fullWidth'
          >
            <Tab label='Overview' icon={<Person />} />
            <Tab label='Aggregations' icon={<ScatterPlot />} />
            <Tab label='Assessments' icon={<Assessment />} />
          </Tabs>
        </Paper>

        {activeTab === 0 && (
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
        )}

        {activeTab === 1 && (
          <div className={styles.Paper}>
            <MaterialTable
              columns={[
                {
                  title: 'Associate',
                  field: 'name',
                  render: (rowData: any) => (
                    <Button
                      color='primary'
                      onClick={() => {
                        const { cycle } = getItemInArrayByName(
                          associates,
                          rowData.name
                        );
                        history.push(
                          `/cycle/${cycle}/associate/${rowData.name
                            .split(' ')
                            .join('-')}`
                        );
                      }}
                    >
                      {rowData.name}
                    </Button>
                  )
                },
                { title: 'Combined', field: 'combined' },
                { title: 'Assessments', field: 'assessments' },
                { title: 'Attendance', field: 'attendance' },
                { title: 'Module Time', field: 'moduleTime' }
              ]}
              data={this.createAggrTableData(
                cycleAggregations,
                associates,
                showInactiveAggr
              )}
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
                        checked={showInactiveAggr}
                        onChange={this.toggleHandler('showInactiveAggr')}
                        leftLabel='Active'
                        rightLabel='Inactive'
                      />
                    </div>
                    <MTableToolbar {...props} />
                  </div>
                )
              }}
            />
          </div>
        )}

        {activeTab === 2 && (
          <div className={styles.Paper}>
            <MaterialTable
              columns={[
                {
                  title: 'Associate',
                  field: 'name',
                  render: (rowData: any) => (
                    <Button
                      color='primary'
                      onClick={() => {
                        const { cycle } = getItemInArrayByName(
                          associates,
                          rowData.name
                        );
                        history.push(
                          `/cycle/${cycle}/associate/${rowData.name
                            .split(' ')
                            .join('-')}`
                        );
                      }}
                    >
                      {rowData.name}
                    </Button>
                  )
                },
                { title: 'Projects', field: 'projectAvg' },
                { title: 'Quizzes', field: 'quizAvg' },
                { title: 'Soft Skills', field: 'softSkillsAvg' },
                { title: 'Exercises', field: 'exerciseAvg' }
              ]}
              data={this.createAssessmentTableData(
                cycleAggregations,
                associates,
                showInactiveAggr
              )}
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
                        checked={showInactiveAggr}
                        onChange={this.toggleHandler('showInactiveAggr')}
                        leftLabel='Active'
                        rightLabel='Inactive'
                      />
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

export default AssociatesTable;
