import { SIGN_IN, SIGN_OUT } from '../actions/actionTypes';

const initialState = {
	isSignedIn: false,
	token: null,
	loading: false,
	error: false
}

export default function (state = initialState, action) {
	switch (action.type) {
		case SIGN_IN: {
			const userAuth = action.user.getAuthResponse(true);
			return {
				...state,
				isSignedIn: true,
				token: userAuth.access_token,
				loading: false,
				error: false
			};
		}
		case SIGN_OUT: {
			return {
				...state,
				isSignedIn: false,
				token: null,
				loading: false,
				error: false
			};
		}
		default:
      		return state;
	}
}