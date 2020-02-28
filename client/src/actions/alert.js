import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

//want to be able to dispatch more than action type from this function, will use dispatch fxn, part of thunk middleware
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout); //will remove alert after 5 seconds, matches id of the alert
};
