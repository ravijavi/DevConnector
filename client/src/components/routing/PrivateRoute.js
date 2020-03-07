import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const PrivateRoute = (
  { component: Component, auth: { isAuthenticated, loading }, ...rest } //anything passed in the rest, we want here
) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
); //...rest will take in anything else that's passed in
//will use private route, and use render prop, if user is not auth and not loading, then we will redirect to login, otherwise component will load

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
