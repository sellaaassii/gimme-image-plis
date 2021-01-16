import 'bootstrap/dist/css/bootstrap.css';
import './Photo.css';
import Loading from './loading.gif';
import React, { Component } from "react";

class Photo extends Component {

  constructor( props ) {
    super(props);
    this.state = {
      data: {},
      contentType: '',
      picture: {},
      loading: true,
      name: '',
      caption: ''
    };
  }

  componentDidMount() {
    this.getPhoto()
      .then(res => {
        this.setState({
          data: res.photo.data,
          contentType: res.photo.contentType,
          name: res.name,
          caption: res.caption,
          loading: false,
          picture: Buffer.from(res.photo.data).toString('base64')
        });
      })
      .catch(err => console.log(err));
  }


  getPhoto = async () => {
    const email = localStorage.email

    const response = await fetch('/api/photo/'+ this.props.photoid, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'email': email,
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };


  deletePhoto = async () => {
    const email = localStorage.email

    const response = await fetch('/api/photo/'+ this.props.photoid, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'email': email,
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    // reload after deletion to allow photo component to be removed
    window.location.reload(false);
  };


  render() {

    return (
      <div className="photoOutline">
        <div >
          {this.state.loading ? <img src={Loading} alt="Loading"/>
          : <img className="uploaded-image" src={`data:image/png;base64,${this.state.picture}`} alt="Picture"/>}
        </div>
        <div className="text-section">
          <p className="filename"><span className="filename-bold">Filename:</span> {this.state.loading ? "" : this.state.name}</p>
          <p className="uploaded-caption caption-title"><span className="caption-title-bold">Caption:</span> {this.state.loading ? "" : this.state.caption}</p>
          <button className="btn btn-danger deleteButton" type="button" onClick={this.deletePhoto} disabled={this.state.loading}>Remove</button>
        </div>

      </div>
    );
  }
}

export default Photo;
