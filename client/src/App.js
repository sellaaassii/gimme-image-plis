import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Switch, Route} from 'react-router-dom';
import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Register from './Register.js';
import Login from './Login.js'
import Dashboard from './Dashboard.js'
import Search from './Search.js'
import Album from './Album.js'
import Lost from './Lost.js'
import Navbar from './Navbar.js'


const token = localStorage.token

// Log user out if token has expired
if (token) {
  const decodedToken = jwt_decode(token);

  const currentTime = Date.now() / 1000;
// compare expiration time with current time and log user out if expired
  if (decodedToken.exp < currentTime) {
    localStorage.clear();
    window.location.href = "/login";
  }

}

const MainNavBar = withRouter((props) =>
  <div className="mainnav">
  { (props.location.pathname === "/search" || props.location.pathname === "/album" || props.location.pathname === "/home")
  &&
  <Navbar
    {...props}
    logout={() => {
      localStorage.clear();
      props.history.push('/login');
    }}
   />}
  </div>
);


class App extends Component {

  render() {
    return (
      <div className="App">
      <MainNavBar />
      <div>
      <Switch>
              <Route exact path="/" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route path="/login" component={Login}/>
              <Route path="/home" component={Dashboard}/>
              <Route path="/album" component={Album}/>
              <Route path="/search" component={Search}/>
              <Route component={Lost}/>
      </Switch></div>
      </div>
    );
  }

}

export default App;
