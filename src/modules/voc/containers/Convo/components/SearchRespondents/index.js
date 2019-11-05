/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';

import './index.css';
import * as liveChatActions from '../../flux/actions';

const WAIT_INTERVAL = 750;

@connect((state) => ({
  convo: state.convo,
}),
(dispatch) => ({
  liveChatActions: bindActionCreators(liveChatActions, dispatch),
  dispatch,
}))

export default class SearchRespondents extends Component {
  static propTypes = {
    alertActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.onSearchConversations = this.onSearchConversations.bind(this);
    this.onCancelSearch = this.onCancelSearch.bind(this);
  }

  state = {
    searchTerm: '',
    limit: 15,
    offset: 0,
    isSearchingConversations: false,
  };

  componentWillMount() {
    this.timer = null;
  }

  onSearchTermChange(event) {
    clearTimeout(this.timer);
    const searchTerm = event.target.value;
    this.setState({ searchTerm }, () => {
      this.timer = setTimeout(() => {
        this.onSearchConversations(searchTerm);
      }, WAIT_INTERVAL);
    });
  }

  async onSearchConversations(searchTerm) {
    this.setState({ isSearchingConversations: true });
    const { limit, offset } = this.state;
    const { activePlatformId } = this.props;

    if (searchTerm.length) {
      try {
        const fetchConversationsResult = await this.props.liveChatActions.fetchConversations(activePlatformId, limit, offset, searchTerm);
        this.props.liveChatActions.setConversations({
          conversations: fetchConversationsResult.data.Data.items,
          totalCount: fetchConversationsResult.data.Data.totalCount,
        });
      } catch (exception) {
        this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      } finally {
        this.setState({ isSearchingConversations: false });
      }
    } else {
      this.setState({ searchTerm: '', isSearchingConversations: false });
    }
  }

  onCancelSearch() {
    this.setState({ searchTerm: '', isSearchingConversations: false });
  }

  render() {
    const { isSearchingConversations, searchTerm } = this.state;
    return (
      <div style={{ width: '100%', height: 40, fontFamily: 'Lato', fontSize: 12, fontWeight: 600, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.6, color: '#ffffff', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, bottom: 0, left: 10 }}>
          {
            isSearchingConversations ? (<Spinner spinnerColor="#ffffff" size={22} spinnerWidth={3} />) : searchTerm.length ? (<i className="material-icons" role="button" tabIndex={0} onClick={this.onCancelSearch}>cancel</i>) : (<i className="material-icons">search</i>)}
        </div>
        <input value={searchTerm} onChange={this.onSearchTermChange} style={{ width: '100%', height: 40, backgroundColor: '#487db3', paddingLeft: 45 }} className="search-respondents" placeholder="Search respondents" />
      </div>
    );
  }
}
