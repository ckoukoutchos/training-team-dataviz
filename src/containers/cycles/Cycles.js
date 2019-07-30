import React, { Component } from 'react';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import styles from './Cycles.module.css';
import { fetchAllCyclesMetrics } from '../../redux/actions';
import { calcPercentiles, formatPercentile } from '../../shared/dataService';
import CONSTS from '../../shared/constants';
import CycleInfo from '../../components/cycle-info/CycleInfo';
import Spinner from '../../components/spinner/Spinner';

class Cycles extends Component {
  componentDidMount() {
    if (!Object.keys(this.props.allCycleAggr).length) {
      this.props.fetchAllCycles();
    }
  }

  render() {
    const { allCycleAggr, cycleAggr, cycleMetadata, loading } = this.props;

    return (
      !loading ? <div className={styles.Paper}>
        <MaterialTable
          title="Cycle Assessment Average & Percentile"
          columns={[
            { title: 'Cycle', field: 'name' },
            { title: 'Projects', field: 'projectAvg' },
            { title: 'Quizzes', field: 'quizAvg' },
            { title: 'Soft Skills', field: 'softSkillsAvg' }
          ]}
          data={
            Object.entries(cycleAggr).map(([name, values]) => ({
              name: CONSTS[name],
              projectAvg: `${values[name].projectAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.projectScores, values[name].projectAvg))}`,
              quizAvg: `${values[name].quizAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.quizScores, values[name].quizAvg))}`,
              softSkillsAvg: `${values[name].softSkillsAvg}% / ${formatPercentile(calcPercentiles(allCycleAggr.softSkillsScores, values[name].softSkillsAvg))}`
            }))
          }
          options={{
            sorting: true
          }}
          detailPanel={[
            {
              tooltip: 'Show Name',
              render: rowData => {
                return <CycleInfo bodyOnly cycleName={CONSTS[rowData.name]} metadata={cycleMetadata[CONSTS[rowData.name]]} />;
              },
            }
          ]}
          actions={[
            {
              icon: 'search',
              tooltip: 'View Cycle',
              onClick: (event, rowData) => {
                this.props.history.push(`/cycle/${CONSTS[rowData.name]}`)
              }
            }
          ]}
        />
      </div> : <Spinner />
    )
  };
}

const mapStateToProps = state => ({
  allCycleAggr: state.cycles.allCycleAggr,
  cycleAggr: state.cycles.cycleAggr,
  cycleMetadata: state.cycles.cycleMetadata,
  loading: state.cycles.loading
});

const mapDispatchToProps = dispatch => ({
  fetchAllCycles: () => dispatch(fetchAllCyclesMetrics())
});

export default connect(mapStateToProps, mapDispatchToProps)(Cycles);