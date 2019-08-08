import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../../User';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser && ['admin', 'root'].includes(currentUser.role) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location },
          }} />
        )
      }
    />
  );
};
export { AdminRoute };
