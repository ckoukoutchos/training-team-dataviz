import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import styles from './Associate.module.css';
import AssociateInfo from '../../components/associateInfo/AssociateInfo';

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

    console.log(associate);
    return (
      !this.props.loading && associate ?
        <>
          <AssociateInfo cycle='Mastery Learning Portland 2019' associate={associate} />
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
        </>
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