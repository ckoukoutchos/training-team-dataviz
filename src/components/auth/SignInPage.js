import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import styles from './SignInPage.module.css';
import { ReactComponent as Lock } from '../../images/lock.svg'

class SignInPage extends Component {

	render() {
		return (
			<div className={styles.Main}>
			{ this.props.isSignedIn ? 
				<Redirect to="/" /> :
				<>
					<Lock />
					<Typography variant='h6'>Please sign in to continue...</Typography>
				</>
			}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	isSignedIn: state.user.isSignedIn
});
  
export default connect(mapStateToProps)(SignInPage);
