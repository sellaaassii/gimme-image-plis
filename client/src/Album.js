import './Album.css'
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Photo from './Photo.js'



class Album extends Component {

  state = {
    emailExists: '',
    photos: []
  };

  componentDidMount() {
    this.getPhotos()
    .then(res => {
      this.setState({photos: res.photos})
    })
    .catch(error => console.log(error));
  }

  getPhotos = async () => {
    const email = localStorage.email;

    if (email) {
      this.setState({ emailExists: email });

      const response = await fetch('/api/photo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'email': email,
        },
      });

      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    }
  }

  render() {

    const loggedIn = localStorage.token;

    if(!loggedIn) {
      return <Redirect to="/login" />
    }

  return (
    <div className="Search">
    <h1 className="album-title">ALBUM</h1>
    { this.state.photos.length === 0 ? <h2>No Photos uploaded</h2> : <h2></h2> }
    <div className="album">{this.state.photos.map(id => (
      <Photo photoid={id}/>
    ))}</div>
    </div>
  );
}
}

export default Album;
