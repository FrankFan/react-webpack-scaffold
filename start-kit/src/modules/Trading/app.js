import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
} from 'react-router';
import FastClick from 'fastclick';
import Home from './components/Home';
import {
  AppContainer,
} from 'lubase';
import ContractPage from './components/ContractPage';
import TradeConfirm from './components/TradeConfirm';
import PayConfirm from './components/PayConfirm';
import TradeResult from './components/TradeResult';
import InvestmentVoucher from './components/InvestmentVoucher';

const start = () => {
  FastClick.attach(document.body);
  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={Home} sharable={true}/>
        <Route path="/home" component={Home} />
        <Route path="/contract" component={ContractPage} sharable={false}/>
        <Route path="/tradeconfirm" component={TradeConfirm} sharable={false} />
        <Route path="/payconfirm" component={PayConfirm} sharable={false}/>
        <Route path="/tradeResult" component={TradeResult} sharable={false}/>
        <Route path="/investmentVoucher" component={InvestmentVoucher} sharable={false}/>
      </Route>
    </Router>
  ), document.getElementById('app'));
};

start();
