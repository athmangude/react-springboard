import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const DisprotectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (rest.authentication.user) {
                    return (
                        <Redirect
                            to={{ pathname: '/' }}
                        />
                    );
                }

                return (
                    <Component {...props} />
                );
            }}
        />
    );
}

export default connect(state => ({ authentication: state.authentication }))(DisprotectedRoute);