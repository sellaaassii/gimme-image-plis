import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import './Search.css'
import axios from 'axios';
import Photo from './Photo.js'


class Search extends Component {

  constructor( props ) {
    super( props );
    this.state = {
    	query: '',
    	loading: false,
    	message: '',
    };

	  this.cancel = '';
  }

  handleOnInputChange = (event) => {
	  const query = event.target.value;

    if ( !query ) {
		  this.setState({ query, results: {}, message: '' } );
	  } else {
  		this.setState({ query, loading: true, message: '' }, () => {
  			this.getSearchResults(query);
  		});
	  }

  };

  getSearchResults = async (query) => {
    if ( this.cancel ) {
		  this.cancel.cancel();
	  }

	  this.cancel = axios.CancelToken.source();

    await axios
		  .get('/api/photo/search?searchString='+ query, {
			  cancelToken: this.cancel.token,
        headers: {
          'email': localStorage.email
        }
		  })
		  .then((res) => {
			  const noPhotosFound = !res.data.photos.length
				  ? 'No results found.'
				  : '';
			  this.setState({
				  results: res.data.photos,
				  message: noPhotosFound,
				  loading: false,
			  });
		  })
		  .catch((error) => {
			  if (axios.isCancel(error) || error) {
				  this.setState({
					  loading: false,
					  message: 'Could not get results.',
				  });
			  }
		  });
  }

  renderSearchResults = () => {
	  const { results } = this.state;

	  if ( results ) {

      if ( Object.keys(results).length && results.length ) {

        return (
			    <div className="album">
				    {results.map((result) => {
					    return (
                <Photo key={result._id} photoid={result._id}/>
					    );
				    })}
			    </div>
		    );
	    }
    }
  };

  render() {

    const loggedIn = localStorage.token;

    if ( !loggedIn ) {
      return <Redirect to="/login" />
    }

    const { query, message } = this.state;

    return (
      <div className="dash">
        <h1 className="search-title">Search</h1>
        <input id="search-input" type="search" value={query} onChange={this.handleOnInputChange} />
        <i className="fa fa-search search-icon"/>
        { message && <p className="message">{message}</p> }
        { this.renderSearchResults() }
      </div>
    );
  }

}

export default Search;
