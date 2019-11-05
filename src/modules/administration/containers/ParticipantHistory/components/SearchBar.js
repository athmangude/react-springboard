/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { Component } from 'react';
import Spinner from 'react-spinner-material';
import PropTypes from 'prop-types';

import ParticpantHistoryList from './ParticipantHistoryList';

class SearchBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    participantActions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }

  state = {
    searchTerm: '',
    particpantHistoryResult: [],
    isSearching: false,
  }

  onChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  async onSearch() {
    const { participantActions, alertActions, EventHandler } = this.props;
    const { searchTerm } = this.state;
    try {
      this.setState({ isSearching: true });
      const searchParticipantResult = await participantActions.fetchParticipantHistory(encodeURIComponent(searchTerm));
      alertActions.addAlert({ type: 'success', message: 'Participant history fetched succesfully!' });
      this.setState({ particpantHistoryResult: searchParticipantResult.data.Data });      
    } catch (exception) {
      let errorMessage = 'Oops! Something went wrong and we could not fetch participant history. Please try again later.';

      if (Object.keys(exception).includes('message')) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes('response')) {
        if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      alertActions.addAlert({ type: 'error', message: errorMessage });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isSearching: false });
    }
  }

  render() {
    const { placeholder } = this.props;
    const { particpantHistoryResult, searchTerm, isSearching } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

        <div
          style={{ 
            display: 'flex', 
            flexDirection: 'row',
            // backgroundColor: '#e8eaed',
            height: 50,
            // borderRadius: 25,
            outline: 'none',
            fontSize: 21,
            padding: '0 0 0 20px',
            width: '25%',
            borderBottom: '1px solid #e8eaed',
          }}
        >
          <input
            type="text"
            value={searchTerm}
            placeholder={placeholder}
            onChange={this.onChange}
            style={{ width: '100%' }}
          />
          <div
            role="button"
            onClick={this.onSearch}
            style={{ zIndex: 1, margin: '5px 5px' }}
          >            
            <i
              className="material-icons" 
              style={{ color: '#d9d9d9', fontSize: 40 }}              
            >
              search
            </i>
          </div>
        </div>

        <div>
          <small>Include the country code e.g. +1</small>
          <br />
          <small>If adding the country code does not work, try removing the <strong>+</strong> prefix. This is especially needed for Nigerian and SA numbers.</small>
        </div>

        {
          isSearching ? (
            <div>
              <Spinner spinnerColor="#808285" size={50} spinnerWidth={3} />
            </div>
          ) : !isSearching && particpantHistoryResult.length === 0 ? (
            <div
              className="search-results"              
            >
              <span>No results</span>
            </div>
          ) : !isSearching && particpantHistoryResult.length > 0 ? (
            <ParticpantHistoryList particpantHistoryResult={particpantHistoryResult} />
          ) : null
        }
      </div>
    );
  }
}
export default SearchBar;
