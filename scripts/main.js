/* React */
import React from 'react';        // Main
import ReactDOM from 'react-dom'; // HTML library

/* React Router Components*/
import {Router, Route} from 'react-router';

/* History for clean URLs */
import {createHistory} from 'history';

/* App Components */
import NotFound from './components/NotFound';
import App from './components/App';
import Bmr from './components/Bmr';

/* Routing */
var routes = (
  <Router history={createHistory()}>
    <Route path='/' component={App} />
    <Route path='*' component={NotFound} />
  </Router>
)

/*
  Use ReactDOM to render dynamic components to HTML page
  Use ReactRouter (routes) to manage page flow
*/
ReactDOM.render(routes, document.querySelector('#main'))
