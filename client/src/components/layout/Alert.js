import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; //any time you want to interact a component with Redux, whether calling an action or getting a state, you want to use connect

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    //whenever you map through jsx like this, it's a list and you need a unique key
    <div key={alert.id} class={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  )); //map fxn will do a foreach and return a jsx for each alert

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert //alert keyword from root reducer in index.js
}); //mapping redux state to a prop in this component, so you have access to it. In this case, it's the array of alerts

export default connect(mapStateToProps)(Alert);
