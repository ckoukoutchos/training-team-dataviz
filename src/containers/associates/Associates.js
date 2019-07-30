import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllCyclesMetrics } from '../../redux/actions';
import MaterialTable from 'material-table';
import Spinner from '../../components/spinner/Spinner';
import AssociateInfo from '../../components/associate-info/AssociateInfo';
import { calcPercentiles, formatPercentile } from '../../shared/dataService';
import styles from './Associates.module.css';

class Associates extends Component {
  componentDidMount() {
    if (!Object.keys(this.props.allCycleAggr).length) {
      this.props.fetchAllCycles();
    }
  }

  createTableData(cycleAggr, allCycleAggr) {
    const associateScores = [];
    for (const cycle in cycleAggr) {
      associateScores.push(...Object.entries(cycleAggr[cycle]).map(([name, values]) => ({
        name,
        projectAvg: `${values.projectAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.projectScores, values.projectAvg))}`,
        quizAvg: `${values.quizAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.quizScores, values.quizAvg))}`,
        softSkillsAvg: `${values.softSkillsAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.softSkillsScores, values.softSkillsAvg))}`,
        attemptPass: values.attemptPass + '%'
      })))
    }
    return associateScores;
  }

  render() {
    const { allCycleAggr, cycleAggr, cycleMetrics, loading } = this.props;
    let table = <Spinner />;

    if (!loading && Object.keys(cycleAggr).length && Object.keys(cycleMetrics).length && Object.keys(allCycleAggr).length) {
      table = (
        <div className={styles.Paper}>
          <MaterialTable
            title="Associate Assessment Average & Percentile"
            columns={[
              { title: 'Associate', field: 'name' },
              { title: 'Projects', field: 'projectAvg' },
              { title: 'Quizzes', field: 'quizAvg' },
              { title: 'Soft Skills', field: 'softSkillsAvg' },
              { title: 'Attempt/Pass', field: 'attemptPass' }
            ]}
            data={this.createTableData(cycleAggr, allCycleAggr)}
            options={{
              sorting: true
            }}
            detailPanel={[
              {
                tooltip: 'Show Name',
                render: rowData => {
                  let cycleName = 'mlPortland2019';
                  for (const cycle in cycleAggr) {
                    if (cycleAggr[cycle][rowData.name]) {
                      cycleName = cycle;
                    }
                  }
                  return <AssociateInfo bodyOnly cycle={cycleName} associate={cycleMetrics[cycleName].find(row => row[0].Person === rowData.name)} />;
                },
              }
            ]}
            actions={[
              {
                icon: 'search',
                tooltip: 'View Associate',
                onClick: (event, rowData) => {
                  let cycleName = 'mlPortland2019';
                  for (const cycle in cycleAggr) {
                    if (cycleAggr[cycle][rowData.name]) {
                      cycleName = cycle;
                    }
                  }
                  this.props.history.push(`/cycle/${cycleName}/associate/${rowData.name.split(' ').join('-')}`)
                }
              }
            ]}
          />
        </div>
      );
    }

    return table;
  }
}

const mapStateToProps = state => ({
  allCycleAggr: state.cycles.allCycleAggr,
  cycleAggr: state.cycles.cycleAggr,
  cycleMetrics: state.cycles.cycleMetrics,
  loading: state.cycles.loading
});

const mapDispatchToProps = dispatch => ({
  fetchAllCycles: () => dispatch(fetchAllCyclesMetrics())
});

export default connect(mapStateToProps, mapDispatchToProps)(Associates);