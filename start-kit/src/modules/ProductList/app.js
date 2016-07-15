import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
} from 'react-router';
import {
  AppContainer,
} from 'lubase';

import Home from './components/Home';
import List from './components/List';

const start = () => {
  FastClick.attach(document.body);
  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={List}/>
        <Route path="/home" component={Home} />
        <Route path="/list" component={List} />
      </Route>
    </Router>
  ), document.getElementById('app'));
};

start();
