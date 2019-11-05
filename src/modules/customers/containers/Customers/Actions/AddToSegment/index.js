/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import numeral from 'numeral';
import Checkbox from '@material-ui/core/Checkbox';

import IconButton from 'SharedComponents/icon-button';
import ActionButton from 'SharedComponents/action-button-styled';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class AddToSegment extends Component {
  static propTypes = {
    onCloseSidePanel: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.onSearchSegments = this.onSearchSegments.bind(this);
    this.onChange = this.onChange.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.state = {
      searchTerm: '',
      showMatches: '',
      segments: [],
      limit: 30,
      currentPage: 1,
      isLoadingSegments: false,
      selectedSegments: [],
      searchedOptions: [],
    };
  }

  componentWillMount() {
    this.fetchSegments();
  }

  onChange(segment) {
    const { selectedSegments } = this.state;

    const columnIndex = selectedSegments.findIndex((item) => item === segment.id);

    if (columnIndex !== -1) {
      selectedSegments.splice(columnIndex, 1);
    } else {
      selectedSegments.push(segment.id);
    }
    this.setState({ selectedSegments });
  }

  onSearchTermChange(event) {
    clearTimeout(this.timer);
    const searchTerm = event.target.value;
    this.setState({ searchTerm }, () => {
      this.onSearchSegments(searchTerm);
    });
  }

  onSearchSegments(searchTerm) {
    const { segments } = this.state;

    this.setState({ searchedOptions: segments.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase())) });
  }

  isSelected(value) {
    const { selectedSegments } = this.state;

    const index = selectedSegments.findIndex((item) => item === value);

    if (index !== -1) {
      return true;
    }

    return false;
  }

  async fetchSegments() {
    const { customerAnalyticsActions } = this.props;
    const { limit, currentPage } = this.state;
    this.setState({ isLoadingSegments: true });
    try {
      const fetchSegmentsResult = await customerAnalyticsActions.fetchSegments(limit, (currentPage - 1) * limit);
      this.setState({ segments: fetchSegmentsResult.data.Data });
    } catch (exception) {
      console.log(exception);
    } finally {
      this.setState({ isLoadingSegments: false });
    }
  }

  render() {
    const { onCloseSidePanel } = this.props;
    const { searchTerm, isLoadingSegments, showMatches, segments, searchedOptions } = this.state;

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, zIndex: 10, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Add to segment</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        {
          isLoadingSegments ? (
            <div style={{ isSavingSegmentwidth: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Loading segments...</span>
            </div>
          ) : (
            <div style={{ padding: '0 10px 0 10px' }}>
              <div style={{ width: '100%', margin: '10px 0', position: 'relative', boxShadow: showMatches ? '0 0 10px rgba(0, 0, 0, 0.3)' : 'none' }}>
                <div style={{ width: '100%', display: 'flex' }}>
                  <input
                    type="search"
                    value={searchTerm}
                    placeholder="Search segments"
                    style={{ width: '100%', height: 50, backgroundColor: '#e8eaed', borderRadius: showMatches || (searchTerm.length) ? 0 : 25, outline: 'none', padding: '0 50px 0 20px', fontSize: 15, textAlign: 'left' }}
                    onChange={this.onSearchTermChange}
                  />
                </div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 20, marginTop: 10 }}>
                {
                  (searchedOptions.length) ? (
                    searchedOptions.map((segment) => (
                      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: 'transparent' }}>
                        <Checkbox
                          disableTouchRipple
                          checked={this.isSelected(segment.id)}
                          onChange={(e) => this.onChange(segment, e)}
                          style={{ color: '#888888', textTransform: 'capitalize' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }} onClick={() => this.onViewSegmentCustomers(segment)}>
                          <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: stringToHexColor(`${segment.name}`).backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stringToHexColor(`${segment.name}`).color }}>{extractInitials(`${segment.name}`)}</div>
                          <span>{segment.name}</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                          <i className="material-icons" style={{ fontSize: 20, marginRight: 10, color: '#808285' }}>people_outline</i>
                          <span>{numeral(segment.count).format('0.0 a').replace(' ', '')}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    segments.map((segment) => (
                      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: 'transparent' }}>
                        <Checkbox
                          disableTouchRipple
                          checked={this.isSelected(segment.id)}
                          onChange={(e) => this.onChange(segment, e)}
                          style={{ color: '#888888', textTransform: 'capitalize' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }} onClick={() => this.onChange(segment)}>
                          <span>{segment.name}</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                          <i className="material-icons" style={{ fontSize: 20, marginRight: 10, color: '#808285' }}>people_outline</i>
                          <span>{numeral(segment.count).format('0.0 a').replace(' ', '')}</span>
                        </div>
                      </div>
                    ))
                  )
                }
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0', marginBottom: 100 }}>
                <ActionButton className="primary" type="submit" text="Submit" style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}
