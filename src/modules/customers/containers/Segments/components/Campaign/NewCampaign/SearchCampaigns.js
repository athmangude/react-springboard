/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import Spinner from 'react-spinner-material';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import { bindActionCreators } from 'redux';

import * as conversationActions from 'Modules/voc/containers/Conversations/flux/actions';

const WAIT_INTERVAL = 750;

@connect((state) => ({
  conversations: state.conversations,
}),
(dispatch) => ({
  conversationActions: bindActionCreators(conversationActions, dispatch),
  dispatch,
}))
@observer
class SearchCampaign extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    conversationActions: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isSearchingSurveys: false,
      matchedSurveys: [],
      searchTerm: '',
      surveyId: null,
    };

    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.onSearchSurveys = this.onSearchSurveys.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onCancelSearch = this.onCancelSearch.bind(this);
  }

  componentWillMount() {
    this.timer = null;
  }


  onSearchTermChange(event) {
    clearTimeout(this.timer);
    const searchTerm = event.target.value;
    this.setState({ searchTerm }, () => {
      this.timer = setTimeout(() => {
        this.onSearchSurveys();
      }, WAIT_INTERVAL);
    });
  }

  async onSearchSurveys() {
    const { conversationActions, account } = this.props;
    const { searchTerm } = this.state;

    this.setState({ matchedSurveys: [], isSearchingSurveys: true });

    if (searchTerm.length) {
      try {
        const fetchSurveysResult = await conversationActions.searchSurveys(searchTerm, account.id);
        this.setState({ matchedSurveys: fetchSurveysResult.data.Data.objects });
      } catch (exception) {
        this.setState({ matchedSurveys: [] });
      } finally {
        this.setState({ isSearchingSurveys: false });
      }
    } else {
      this.setState({ matchedSurveys: [], searchTerm: '', isSearchingSurveys: false });
    }
  }

  onCancelSearch() {
    this.setState({
      matchedSurveys: [], searchTerm: '', isSearchingSurveys: false, surveyId: null,
    });
  }

  onSelect(survey) {
    const { onSelect } = this.props;

    this.setState({ searchTerm: survey.title, matchedSurveys: [], surveyId: survey.id }, () => onSelect(survey));
  }

  render() {
    const {
      matchedSurveys, searchTerm, isSearchingSurveys, surveyId,
    } = this.state;

    const showMatches = matchedSurveys && matchedSurveys.length && searchTerm.length;

    return (
      <div style={{ width: '100%', margin: '10px 0', position: 'relative', boxShadow: showMatches ? '0 0 10px rgba(0, 0, 0, 0.3)' : 'none' }}>
        <div style={{ width: '100%', display: 'flex' }}>
          <input
            type="search"
            value={searchTerm}
            placeholder="Search surveys"
            style={{ width: '100%', height: 50, backgroundColor: '#e8eaed', borderRadius: showMatches || (searchTerm.length && !isSearchingSurveys && !matchedSurveys.length) ? 0 : 25, outline: 'none', padding: '0 50px 0 20px', fontSize: 15, textAlign: 'left' }}
            onChange={this.onSearchTermChange}
          />
          {
            isSearchingSurveys ? (
              <div style={{ position: 'absolute', top: 10, bottom: 0, right: 10 }}>
                <Spinner spinnerColor="#808285" size={30} spinnerWidth={3} />
              </div>
            ) : searchTerm.length ? (
              <div role="button" tabIndex={0} onClick={this.onCancelSearch} style={{ position: 'absolute', top: 5, bottom: 0, right: 5 }}>
                <i className="material-icons" style={{ color: '#808285', fontSize: 40, cursor: 'pointer' }}>cancel</i>
              </div>
            ) : (
              <div style={{ position: 'absolute', top: 5, bottom: 0, right: 5 }}>
                <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 40 }}>search</i>
              </div>
            )
          }
        </div>
        {
          showMatches ? (
            <div className="search-results" style={{ width: '100%', maxHeight: 200, overflowY: 'auto', position: 'absolute', top: 50, backgroundColor: '#fff', overflow: 'auto', boxShadow: '0 5px 10px rgba(0 , 0, 0, 0.3)', borderBottomRightRadius: 3, borderBottomLeftRadius: 3, zIndex: 9999 }}>
              {
                matchedSurveys.map((survey) => (
                  <div key={survey.id} role="button" tabIndex={0} className="search-results-item" style={{ width: '100%', padding: 10, cursor: 'pointer' }} onClick={() => this.onSelect(survey)}>
                    <span>{survey.title}</span>
                  </div>
                ))
              }
            </div>
          ) : searchTerm.length && !isSearchingSurveys && !surveyId ? (
            <div className="search-results" style={{ width: '100%', maxHeight: 200, overflowY: 'auto', position: 'absolute', top: 50, padding: '20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', overflow: 'auto', boxShadow: '0 5px 10px rgba(0 , 0, 0, 0.3)', borderBottomRightRadius: 3, borderBottomLeftRadius: 3, zIndex: 9999 }}>
              <span>No results found</span>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default SearchCampaign;
