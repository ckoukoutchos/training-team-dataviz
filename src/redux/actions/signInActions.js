import { SIGN_IN, SIGN_OUT } from './actionTypes';

export const signIn = user => ({
    type: SIGN_IN,
    user
});

export const signOut = () => ({
    type: SIGN_OUT
});