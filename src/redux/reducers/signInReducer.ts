import { SIGN_IN, SIGN_OUT, ActionTypes } from '../actionTypes';

interface SignInState {
	isSignedIn: boolean;
	token: String,
	error: any | null;
	loading: boolean;
  }

const initialState = {
	isSignedIn: false,
	token: '',
	loading: false,
	error: false
}

const signInReducer = (state: SignInState = initialState, action: ActionTypes): SignInState => {
  switch (action.type) {
    case SIGN_IN: {
		const userAuth = action.user.getAuthResponse(true);
		return {
			isSignedIn: true,
			token: userAuth.access_token,
			loading: false,
			error: false
		};
	}
    case SIGN_OUT: {
		return {
			isSignedIn: false,
			token: '',
			loading: false,
			error: false
		};
	}
    default: return state;
  }
}

export default signInReducer;