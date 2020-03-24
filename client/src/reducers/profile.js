import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_REPOS
} from '../actions/types';

//actions to get profile, create it, clear it from the state, etc.

const initialState = {
  //if we visit another user's page, this will be added as well
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  //state management of redux, will see these messages if successfully fetching profile
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state, //get current state
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state, //current state
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR: //you can also see this message if successful login, but the user has no profile to speak of
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null //this will prevent a newly registered user from seeing and editing the the previous user's info. This is in the case where a guest user browses and dev profile and then registers.
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false
      };
    default:
      return state;
  }
}
