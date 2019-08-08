import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../../User';

const PublicRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={props =>
        !currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location },
          }} />
        )
    }/>
  );
};

export { PublicRoute };
