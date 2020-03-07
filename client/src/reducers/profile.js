import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from '../actions/types';

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
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case PROFILE_ERROR: //you can also see this message if successful login, but the user has no profile to speak of
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      };
    default:
      return state;
  }
}
