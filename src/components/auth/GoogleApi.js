/* global gapi */
import { Component } from 'react';
import { connect } from 'react-redux';
import { CLIENT_ID, SCOPES } from '../../shared/config';
import { signIn } from '../../redux/actions/signInActions';

const GOOGLE_BUTTON_ID = 'google-sign-in-button';

class GoogleApi extends Component {
	componentDidMount() {
		const { signIn, isSignedIn } = this.props;
		gapi.load('auth2', () => {
			gapi.auth2.init({
				client_id: CLIENT_ID,
				scope: SCOPES
			}).then(function (user) {
				if(user.isSignedIn.get() && !isSignedIn) {
					signIn(user.currentUser.get());
				}
				gapi.signin2.render(GOOGLE_BUTTON_ID, {
					onsuccess: signIn
				})
			});
		});
	}

	render() {
		return null;
	}
}

const mapStateToProps = state => ({
	isSignedIn: state.user.isSignedIn
  });
  
  const mapDispatchToProps = dispatch => ({
	signIn: (user) => dispatch(signIn(user))
  });
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(GoogleApi);