//function that takes in a piece of state (any state that has to do with alerts) and an action.
//An action is going to be dispatched from an actions file

//An example of what a typical alert may look like
/*
const initialState = [
    {
        id:1,
        msg: 'Please log in',
        alertType: 'success',
    },
]
*/

import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function(state = initialState, action) {
  //action will contain a type, and a payload AKA the data. Sometimes there is no data, so you would just call an action type
  const { type, payload } = action; //destructuring, so instead of writing action.type, you can just write type, etc.

  switch (type) {
    case SET_ALERT: //SET_ALERT will be a type, this is a javascript switch
      return [...state, payload]; //state is immutable, adding an alert, including states that are already there, then add new alert
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload); //going to return all alerts except for the one that matches the payload
    default:
      return state; //every reducer I create is going to have a default case of return state
  }
}
