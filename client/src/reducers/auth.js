import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'), //default for token in our state
  isAuthenticated: null, //if successful, will be set to true
  loading: true, //make sure that request has been made to the backend and we get a response
  user: null
}; //our state for authentication

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true, //token worked, now logged in
        loading: false,
        user: payload //will return everything but the password
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token); //if Register_success, set the token
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR: //will clear token from local storage
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token'); //retrieve token from local storage and set to null if there is one
      return {
        ...state,
        token: null, //here we are setting the value to null vs. what is done in the success actio
        isAuthenticated: false,
        loading: false
      };

    default:
      return state;
  }
}
