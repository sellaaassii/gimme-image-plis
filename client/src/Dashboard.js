import 'bootstrap/dist/css/bootstrap.css';
import './Dashboard.css';
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';


class Dashboard extends Component {

  state = {
    selectedPhoto: null,
    filePath: '',
    caption: '',
    inputKey: ''
  };

  handlePhotoSelect = event => {
    const { target } = event
    if ( target.value.length > 0 ) {
      this.setState({selectedPhoto: event.target.files[0], filePath: URL.createObjectURL(event.target.files[0])});
    } else {
      this.setState({selectedPhoto: null, inputKey: Date.now(), caption: '', filePath: ''})
    }
  }

  handleCaptionChange = event => {
    this.setState({caption: event.target.value})
  }

  handleUploadClick = () => {
    if (this.state.selectedPhoto) {
      const formData = new FormData()

      formData.append(
        "caption", this.state.caption
      );
      formData.append(
        "email", localStorage.email
      );

      formData.append("photo", this.state.selectedPhoto);

      axios.post("/api/photo/upload", formData).then((response) => {
        if (response.status === 201) {
          alert('Photo uploaded successfully!')
        }
      }, (error) => {
        alert('File upload failed. Please check that limit is below 3MB')
        console.log(error);
      });

      this.setState({selectedPhoto: null, inputKey: Date.now(), caption: '', filePath: ''})
    }
  }

  displayPhotoData = () => {
    if (this.state.selectedPhoto) {
      return (
        <div>
        <h3>Photo Selected:</h3>
            <img src={this.state.filePath} alt={this.state.selectedPhoto.name} className="uploaded-photo"/>
        </div>
      );
    } else {
      return(<h4 className="upload-error">Please choose a file</h4>)
    }
  }

  render() {
    const loggedIn = localStorage.getItem('token');

    if(!loggedIn) {
      return <Redirect to="/login" />
    }


  return (
    <div className="dashboard card">
      <div className="text-center card-body">
          <h1 className="card-title">Add a photo</h1>
          <hr/>
          <div className="filePickerGroup">
            <div className="row">
                <div className="col filePicker"><input type="file" accept="image/*" onChange={this.handlePhotoSelect} key={this.state.inputKey}/></div>
            </div>
            <div className="row">
                <div className="col filePicker"><label className="captioning">Caption</label><input type="text" value={this.state.caption} onChange={this.handleCaptionChange}/></div>
            </div>
            <div className="row">
                <button className="btn btn-primary uploadButton" type="button" onClick={this.handleUploadClick} disabled={this.state.selectedPhoto === null}>Upload</button>
            </div>
          </div>
          <hr />
          {this.displayPhotoData()}

      </div>
    </div>
  );
  }
}

export default Dashboard;
