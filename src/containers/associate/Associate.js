import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';
import MaterialTable from 'material-table';
import styles from './Associate.module.css';
import AssociateInfo from '../../components/associate-info/AssociateInfo';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import { getUrlParams } from '../../shared/dataService';
import BulletGraph from '../../components/bullet-graph/BulletGraph';
import Spinner from '../../components/spinner/Spinner';

class Associate extends Component {
  componentDidMount() {
    const { cycle } = getUrlParams(this.props.history);
    // only fetches if not already in memory
    if (!Object.keys(this.props.cycleAggr).includes(cycle)) {
      this.props.fetchCycle(cycle);
    }
  }

  render() {
    const { associateMetadata, cycleAggr, cycleMetrics, history } = this.props;
    const { url, cycle, associate } = getUrlParams(history);

    return (
      !this.props.loading && cycleMetrics[cycle] && cycleAggr[cycle] && associateMetadata[associate] ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={url} />

          <AssociateInfo cycle={cycle} associate={cycleMetrics[cycle].find(row => row[0].Person === associate)} />

          <RadarGraph
            title='Running Avg of Assesments'
            subtitle='Compared to Cycle Averages'
            keys={['Cycle Average', associate]}
            data={[
              {
                avg: 'Projects',
                [associate]: cycleAggr[cycle][associate].projectAvg,
                'Cycle Average': cycleAggr[cycle][cycle].projectAvg
              },
              {
                avg: 'Quizzes',
                [associate]: cycleAggr[cycle][associate].quizAvg,
                'Cycle Average': cycleAggr[cycle][cycle].quizAvg
              },
              {
                avg: 'Soft Skills',
                [associate]: cycleAggr[cycle][associate].softSkillsAvg,
                'Cycle Average': cycleAggr[cycle][cycle].softSkillsAvg
              }
            ]}
          />

          <BulletGraph title='Cycle Progress' subtitle='Overall & Per Module' metadata={associateMetadata[associate]} />

          <div className={styles.Paper}>
            <MaterialTable
              title="Associate Metrics"
              columns={[
                { title: 'Interaction', field: 'Interaction' },
                { title: 'Interaction Type', field: 'Interaction Type' },
                { title: 'Score', field: 'Score' },
                { title: 'Date', field: 'Date', type: 'date' }
              ]}
              data={cycleMetrics[cycle].find(row => row[0].Person === associate)}
              options={{
                sorting: true
              }}
            />
          </div>
        </div>
        : <Spinner />
    );
  }
}

const mapStateToProps = state => ({
  associateMetadata: state.cycles.associateMetadata,
  cycleAggr: state.cycles.cycleAggr,
  cycleMetrics: state.cycles.cycleMetrics,
  loading: state.cycles.loading
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: (cycleName) => dispatch(fetchCycleMetrics(cycleName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Associate);