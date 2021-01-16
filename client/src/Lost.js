import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from "react";
import {Link} from 'react-router-dom';

class Lost extends Component {

  render() {
    return (
      <div>
        <h1>404</h1>
        <p>Ma fwend seems like you're kinda lost doe</p>
        <Link className="small" to="/home">Get me out of here plis</Link>
      </div>
    );
  }
}

export default Lost;
