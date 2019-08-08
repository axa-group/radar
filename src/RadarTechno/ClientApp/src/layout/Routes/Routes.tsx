import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { AddTechnology, AllEntities, EntityTechnologies, NewEntity } from '../../Entity';
import Home from '../../Home';
import EnhancedLogin from '../../Login';
import { NotFound } from '../../NotFound';
import { AllTechnologies, NewTechnology } from '../../Technology';
import { AllUsers, NewUser } from '../../User';
import { EnhancedWorkflow } from '../../Workflow';
import { AdminRoute, PrivateRoute, PublicRoute, RootRoute } from '../Routes';

const Routes = () => {
  return (
    <Switch>
      <PublicRoute exact={true} path="/login" key="login" component={EnhancedLogin} />
      <PrivateRoute exact={true} path="/" key="home" component={Home} />
      <PrivateRoute exact={true} path="/workflow" key="workflow" component={EnhancedWorkflow} />
      <PrivateRoute exact={true} path="/technologies" key="technologies" component={EntityTechnologies} />
      <AdminRoute exact={true} path="/all-technologies" key="all-technologies" component={AllTechnologies} />
      <AdminRoute exact={true} path="/users" key="users" component={AllUsers} />
      <RootRoute exact={true} path="/entities" key="entities" component={AllEntities} />
      <RootRoute exact={true} path="/new-technology" key="new-technology" component={NewTechnology} />
      <RootRoute exact={true} path="/new-entity" key="new-entity" component={NewEntity} />
      <AdminRoute exact={true} path="/add-technology" key="add-technology" component={AddTechnology} />
      <AdminRoute exact={true} path="/new-user" key="new-user" component={NewUser} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
