import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

class NavBar extends Component {

  state = {
    name: ''
  }

  componentDidMount() {
    const token = localStorage.token

    if (token) {
      this.getUserInfo()
        .then(res => {
          localStorage.setItem('username', res.name)
          localStorage.setItem('email', res.email)

          this.setState({name: res.name})
        })
        .catch(err => console.log(err));
    }
  }

  getUserInfo = async () => {
    const response = await fetch('/api/user/whoami', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.token,
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <nav className="navbar navbar-light navbar-expand-md navigation-clean-button">
          <div className="container"><a className="navbar-brand" href="/home">Shopstagram</a><button data-toggle="collapse" className="navbar-toggler" data-target="#navcol-1"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
              <div className="collapse navbar-collapse" id="navcol-1">
                  <ul className="nav navbar-nav mr-auto">
                      <li className="nav-item"><a className="nav-link" href="/home">Home</a></li>
                      <li className="nav-item"><a className="nav-link" href="/album">Album</a></li>
                      <li className="nav-item"><a className="nav-link" href="/search">Search</a></li>
                  </ul><span className="navbar-text actions"> <a className="login">Welcome {this.state.name}!</a><a className="btn btn-light action-button" role="button" onClick={this.props.logout}>Logout</a></span>
              </div>
          </div>
      </nav>
    );
  }
}

export default withRouter(NavBar);
