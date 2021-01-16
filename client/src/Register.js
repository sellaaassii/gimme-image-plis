import './Register.css'
import 'bootstrap/dist/css/bootstrap.css';
import './fonts/fontawesome-all.min.css';
import './fonts/font-awesome.min.css';
import './fonts/fontawesome5-overrides.min.css';
import background from './image2.jpeg';
import { Switch, Route, Link } from 'react-router-dom';
import React, { Component } from "react";

class Register extends Component {

  state = {
   response: '',
   email: '',
   password: '',
   confirm: '',
   name: '',
   errors: {},
   error: ''

 };


 handleSubmit = async e => {
   e.preventDefault();

   const response = await fetch('/api/user/register', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       password: this.state.password,
       email: this.state.email,
       confirm: this.state.confirm,
       name: this.state.name
     }),
   });

   const body = await response.json();

   if (response.status === 200) {
     //redirect to login page
     this.props.history.push("/login");
   } else {
     this.setState({ errors: body.errors,  error: body.error });
   }

 };


  render() {
  return(
    <div className="container">
        <div className="card shadow-lg o-hidden border-0 my-5">
            <div className="card-body p-0">
                <div className="row">
                    <div className="col-lg-5 d-none d-lg-flex">
                        <div className="flex-grow-1 bg-register-image" style={{backgroundImage: `url(${background})`}}></div>
                    </div>
                    <div className="col-lg-7">
                        <div className="p-5">
                            <div className="text-center">
                                <p className="error-message">{this.state.error}</p>
                                <h4 className="text-dark mb-4">Create an Account!</h4>
                            </div>
                            <form className="user" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                  <input className="form-control form-control-user" type="text" id="exampleFirstName" placeholder="Full Name" name="first_name" onChange={e => this.setState({ name : e.target.value })}/>
                                </div>
                                <p className="error-message">{this.state.errors.nameMessage}</p>
                                <div className="form-group"><input className="form-control form-control-user" type="email" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Email Address" name="email" onChange={e => this.setState({ email : e.target.value })}/></div>
                                <p className="error-message">{this.state.errors.emailMessage}</p>
                                <div className="form-group row">
                                    <div className="col-sm-6 mb-3 mb-sm-0"><input className="form-control form-control-user" type="password" id="examplePasswordInput" placeholder="Password" name="password" onChange={e => this.setState({ password : e.target.value })}/></div>
                                    <div className="col-sm-6"><input className="form-control form-control-user" type="password" id="exampleRepeatPasswordInput" placeholder="Repeat Password" name="password_repeat" onChange={e => this.setState({ confirm : e.target.value })}/></div>
                                </div><p className="error-message">{this.state.errors.passwordMessage}</p><button className="btn btn-primary btn-block text-white btn-user" type="submit">Register Account</button>
                                <hr/>
                            </form>
                            <div className="text-center"></div>
                            <div className="text-center"><Link className="small" to="/login">Already have an account? Login!</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
}

export default Register;
