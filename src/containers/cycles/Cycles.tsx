import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import MaterialTable, { MTableToolbar } from 'material-table';
import {
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider
} from '@material-ui/core';
import { Autorenew, Assessment, ScatterPlot } from '@material-ui/icons';

import { AppState } from '../../redux/reducers/rootReducer';
import { getItemInArrayByName } from '../../shared/dataService';
import styles from './Cycles.module.css';
import CONSTS from '../../shared/constants';
import { CycleAggregation, Cycle } from '../../models/types';

import CycleInfo from '../../components/cycle-info/CycleInfo';
import Toggle from '../../components/toggle/Toggle';

interface CyclesProps {
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  history: History;
}

interface CyclesState {
  activeTab: number;
  showInactive: boolean;
  showInactiveAggr: boolean;
  [key: string]: any;
}

class Cycles extends Component<CyclesProps, CyclesState> {
  state = {
    activeTab: 0,
    showInactive: false,
    showInactiveAggr: false
  };

  createTableData = (cycles: Cycle[], showInactive: boolean) => {
    const filteredCycles = this.filterCycles(cycles, showInactive);

    return filteredCycles.map((cycle: Cycle) => ({
      name: CONSTS[cycle.name],
      type: cycle.type,
      startDate: cycle.startDate.toDateString(),
      endDate: cycle.endDate ? cycle.endDate.toDateString() : 'Active'
    }));
  };

  createAggrTableData = (
    cycleAggregations: CycleAggregation[],
    cycles: Cycle[],
    showInactiveAggr: boolean
  ) => {
    const filteredCycles = cycles.map((cycle: Cycle) => {
      if (!cycle.active === showInactiveAggr) {
        return cycle.name;
      }
    });
    const tableData: any[] = [];

    cycleAggregations.map((aggregation: CycleAggregation) => {
      if (filteredCycles.includes(aggregation.name)) {
        tableData.push({
          name: CONSTS[aggregation.name],
          combined: `${aggregation.combined}%`,
          assessments: `${aggregation.assessments}%`,
          attendance: `${aggregation.attendance}%`,
          moduleTime: aggregation.moduleTime
            ? `${aggregation.moduleTime}%`
            : 'N/A'
        });
      }
    });
    return tableData;
  };

  createAssessmentTableData = (
    cycleAggregations: CycleAggregation[],
    cycles: Cycle[],
    showInactiveAggr: boolean
  ) => {
    const filteredCycles = cycles.map((cycle: Cycle) => {
      if (!cycle.active === showInactiveAggr) {
        return cycle.name;
      }
    });
    const tableData: any[] = [];

    cycleAggregations.map((aggregation: CycleAggregation) => {
      if (filteredCycles.includes(aggregation.name)) {
        tableData.push({
          name: CONSTS[aggregation.name],
          projectAvg: `${aggregation.projects}%`,
          quizAvg: `${aggregation.quizzes}%`,
          softSkillsAvg: `${aggregation.softSkills}%`,
          exerciseAvg: `${aggregation.exercises}%`
        });
      }
    });
    return tableData;
  };

  filterCycles = (cycles: Cycle[], showInactive: boolean) =>
    cycles.filter((cycle: Cycle) => !cycle.active === showInactive);

  onTabChange = (event: any, value: number) => {
    this.setState({ activeTab: value });
  };

  toggleHandler = (type: string) => () => {
    this.setState((prevState: CyclesState) => ({
      [type]: !prevState[type]
    }));
  };

  render() {
    const { cycleAggregations, cycles, history } = this.props;
    const { activeTab, showInactive, showInactiveAggr } = this.state;

    return (
      <>
        <Paper className={styles.Card}>
          <Typography variant='h2'>Cycles</Typography>

          <Divider style={{ margin: '12px 0' }} />

          <div className={styles.Body}>
            <Typography variant='subtitle1'>
              <strong>Total Cycles: </strong>
              {cycles.length}
            </Typography>

            <Typography variant='subtitle1'>
              <strong>Active Cycles: </strong>
              {cycles.length}
            </Typography>
          </div>
        </Paper>

        <Paper style={{ margin: '16px auto', width: '800px' }}>
          <Tabs
            value={activeTab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.onTabChange}
            variant='fullWidth'
          >
            <Tab label='Overview' icon={<Autorenew />} />
            <Tab label='Aggregations' icon={<ScatterPlot />} />
            <Tab label='Assessments' icon={<Assessment />} />
          </Tabs>
        </Paper>

        {activeTab === 0 && (
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
        )}

        {activeTab === 1 && (
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
                { title: 'Combined', field: 'combined' },
                { title: 'Assessments', field: 'assessments' },
                { title: 'Attendance', field: 'attendance' },
                { title: 'Module Time', field: 'moduleTime' }
              ]}
              data={this.createAggrTableData(
                cycleAggregations,
                cycles,
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
                { title: 'Projects', field: 'projectAvg' },
                { title: 'Quizzes', field: 'quizAvg' },
                { title: 'Soft Skills', field: 'softSkillsAvg' },
                { title: 'Exercises', field: 'exerciseAvg' }
              ]}
              data={this.createAssessmentTableData(
                cycleAggregations,
                cycles,
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

const mapStateToProps = (state: AppState) => ({
  cycleAggregations: state.metrics.cycleAggregations,
  cycles: state.metrics.cycles
});

export default connect(mapStateToProps)(Cycles);
