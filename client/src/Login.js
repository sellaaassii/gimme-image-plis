import './Login.css'
import 'bootstrap/dist/css/bootstrap.css';
import background from './image3.jpeg'
import {Link} from 'react-router-dom';
import React, { Component } from "react";

class Login extends Component {

  state = {
   error: '',
   email: '',
   password: '',
 };

  handleSubmit = async e => {
    e.preventDefault();

    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: this.state.password, email: this.state.email }),
    });

    const body  = await response.json();
    const token = await body.token;

    if (response.status === 200) {
      // redirect to dashboard and set token
      localStorage.setItem('token', token)
      this.props.history.push("/home");
    } else {
      this.setState({ error: body.error });
    }

  };


  render() {
  return (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-9 col-lg-12 col-xl-10">
                <div className="card shadow-lg o-hidden border-0 my-5">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-flex">
                                <div className="flex-grow-1 bg-login-image" style={{backgroundImage: `url(${background})`}}></div>
                            </div>
                            <div className="col-lg-6">
                                <div className="p-5">
                                    <div className="text-center">
                                    <p>{this.state.name}</p>
                                        <h4 className="text-dark mb-4">Welcome Back!</h4>
                                        <p className="error-message">{this.state.error}</p>
                                    </div>
                                    <form className="user" onSubmit={this.handleSubmit}>
                                        <div className="form-group"><input className="form-control form-control-user" type="email" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." name="email" onChange={e => this.setState({ email: e.target.value })}/></div>
                                        <div className="form-group"><input className="form-control form-control-user" type="password" id="exampleInputPassword" placeholder="Password" name="password" onChange={e => this.setState({ password : e.target.value })}/></div>
                                        <button className="btn btn-primary btn-block text-white btn-user" type="submit">Login</button>
                                        <hr/>
                                    </form>
                                    <div className="text-center"></div>
                                    <div className="text-center"><Link className="small" to="/register">Create an Account!</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
}

export default Login;
