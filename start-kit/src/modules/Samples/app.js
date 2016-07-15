import './public/styles/module.css';
import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import SideBar from './components/SideBar';
const start = () => {
  FastClick.attach(document.body);

  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={SideBar} />
        <Route path="app" component={App} />
        <Route path="home" component={Home} />
        <Route path="sidebar" component={SideBar} />
      </Route>
    </Router>
  ), document.getElementById('app'));
};

start();
