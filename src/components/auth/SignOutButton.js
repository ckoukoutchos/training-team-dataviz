/* global gapi */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { signOut } from '../../redux/actions';

const SignOutButton = (props) => {
	const logout = () => {
		let auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(() => {
			props.signOut()
			props.history.push('/signin')
		})
	}

	return (
		<Button 
			color="inherit"
			onClick={logout}
		>Logout</Button>
	)
}

const mapStateToProps = state => ({
	isSignedIn: state.user.isSignedIn
});

const mapDispatchToProps = dispatch => ({
	signOut: () => dispatch(signOut())
  });
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignOutButton));