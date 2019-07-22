import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import styles from './Associate.module.css';
import { ResponsiveRadar } from '@nivo/radar'
import AssociateInfo from '../../components/associateInfo/AssociateInfo';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import { calcProjectScoreAvg, calcQuizScoreAvg, calcSoftSkillsScoreAvg } from '../../shared/dataService';

class Associate extends Component {
  componentDidMount() {
    if (!this.props.mlPortland2019.length) {
      this.props.fetchCycle();
    }
  }

  render() {
    // get params from url
    const associateUrl = this.props.history.location.pathname.split('/');
    // get associate name from url and format to use ' ' instead of '-'
    const associateName = associateUrl[associateUrl.length - 1].split('-').join(' ');
    // find associate data
    const associate = this.props.mlPortland2019.find(associate => associate[0].Person === associateName);

    return (
      !this.props.loading && associate ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={associateUrl} />

          <AssociateInfo cycle='Mastery Learning Portland 2019' associate={associate} />

          <Paper style={{ height: '400px', margin: '16px auto', width: '900px' }}>
            <ResponsiveRadar
              data={[
                {
                  avg: 'Projects',
                  [associateName]: calcProjectScoreAvg(associate),
                  'Cycle Average': calcProjectScoreAvg([].concat(...this.props.mlPortland2019))
                },
                {
                  avg: 'Quizzes',
                  [associateName]: calcQuizScoreAvg(associate),
                  'Cycle Average': calcQuizScoreAvg([].concat(...this.props.mlPortland2019))
                },
                {
                  avg: 'Soft Skills',
                  [associateName]: calcSoftSkillsScoreAvg(associate),
                  'Cycle Average': calcSoftSkillsScoreAvg([].concat(...this.props.mlPortland2019))
                }
              ]}
              keys={['Cycle Average', associateName]}
              indexBy='avg'
              maxValue={100}
              margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
              curve='catmullRomClosed'
              borderWidth={2}
              borderColor={{ from: 'color' }}
              gridLevels={3}
              gridShape='circular'
              gridLabelOffset={15}
              enableDots={true}
              dotSize={10}
              dotColor={{ theme: 'background' }}
              dotBorderWidth={3}
              dotBorderColor={{ from: 'color' }}
              enableDotLabel={false}
              dotLabel='value'
              dotLabelYOffset={-12}
              colors={{ scheme: 'category10' }}
              fillOpacity={0.1}
              blendMode='multiply'
              legends={[
                {
                  anchor: 'top-left',
                  direction: 'column',
                  translateX: -50,
                  translateY: -40,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemTextColor: '#999',
                  symbolSize: 12,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
            />
          </Paper>

          <Paper className={styles.Container}>
            <Table className={styles.Table}>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Interaction</TableCell>
                  <TableCell align='left'>Interaction Type</TableCell>
                  <TableCell align='left'>Score</TableCell>
                  <TableCell align='left'>Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {associate.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align='left'>{row.Interaction}</TableCell>
                    <TableCell align='left'>{row['Interaction Type']}</TableCell>
                    <TableCell align='left'>{row.Score}</TableCell>
                    <TableCell align='left'>{row.Date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
        : <CircularProgress />
    );
  }
}

const mapStateToProps = state => ({
  loading: state.cycles.loading,
  mlPortland2019: state.cycles.mlPortland2019
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: () => dispatch(fetchCycleMetrics())
});

export default connect(mapStateToProps, mapDispatchToProps)(Associate);