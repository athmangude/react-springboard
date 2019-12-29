import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!rest.authentication.user) {
                    return (
                        <Redirect
                            to={{ pathname: "/sign-in" }}
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

export default connect(state => ({ authentication: state.authentication }))(ProtectedRoute);