import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { Grid } from '@material-ui/core';

import Nav from './components/nav';
import Login from './components/login';
import Register from './components/register';
import Contact from './components/contact';
import Feed from './components/feed';
import AddBlog from './components/add';
import EditBlog from './components/edit';
import RemoveUser from './components/remove-user';
import RemoveFeed from './components/remove-feed';

import './styles/app.css';

function App() {

  const getRoutes = () => {
    if (localStorage.usertoken)
      return (
        <Switch>
          <Route exact path='/feed' component={Feed} />
          <Route exact path='/add' component={AddBlog} />
          <Route exact path='/edit' component={EditBlog} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/removefeed' component={RemoveFeed} />
          <Route exact path='/removeuser' component={RemoveUser} />
          
          <Redirect from='*' to='/feed' />
        </Switch>
      );
    else
      return (
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/contact' component={Contact} />
          <Redirect from='*' to='/login' />
        </Switch>
      );
  }

  return (
    <BrowserRouter>
      <Grid item xs={12} className="app-nav-item">
        <Nav />
      </Grid>
      <Grid item xs={12} className="app-nav-item">
        {getRoutes()}
      </Grid>
    </BrowserRouter>
  );
}

export default App;
