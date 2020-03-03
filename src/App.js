import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Dashboard from './components/dashboard.component';
import Marketing from './components/marketing.js';
class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to={'/'} className="navbar-brand">BRECA Shopping center control</Link>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                  <Link to={'/'} className="nav-link">Home/Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/marketing'} className="nav-link">Marketing strategies</Link>
                </li>
              </ul>
            </div>
          </nav>
          <Switch>
              <Route exact path='/marketing' component={ Marketing } />
              <Route exact path='/' component={ Dashboard } />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
