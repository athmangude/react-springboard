import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinner-material';
import PropTypes from 'prop-types';

import ActivityHandler from 'Utils/ActivityHandler';

import './NPSDimensionPill.css';

@connect(() => ({}),
(dispatch) => ({
  dispatch,
}))
class NPSDimensionPill extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    stance: PropTypes.string,
    filter: PropTypes.object,
    appliedNPSFIlters: PropTypes.array,
  };
  constructor(props) {
    super(props);

    this.onAddNPSFilter = this.onAddNPSFilter.bind(this);
    this.onDeleteNPSFilter = this.onDeleteNPSFilter.bind(this);
  }
  state = {
    updatingNPSFIlters: false,
  }

  async onAddNPSFilter() {
    this.setState({ updatingNPSFIlters: true });
    try {
      await this.props.accountActions.addNPSFilter(this.props.surveyId, { name: 'nps_filters', value: this.props.filter });
      await this.props.fetchAppliedNPSFilters();
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully added filter' });
      this.props.EventHandler.trackEvent({ category: 'NPSFilters', action: 'add nps filter', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'NPSFilters', action: 'add nps filter', value: false });
    } finally {
      this.setState({ updatingNPSFIlters: false });
    }
  }

  async onDeleteNPSFilter() {
    this.setState({ updatingNPSFIlters: true });
    try {
      await this.props.accountActions.removeNPSFilter(this.props.surveyId, this.props.filter.id);
      await this.props.fetchAppliedNPSFilters();
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully removed filter' });
      this.props.EventHandler.trackEvent({ category: 'NPSFilters', action: 'remove nps filter', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'NPSFilters', action: 'remove nps filter', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ updatingNPSFIlters: false });
    }
  }

  render() {
    return (
      <div>
        {
          this.props.stance === 'positive' ? (
            <div className="nps-dimension-pill positive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 25, border: 'solid 1px #d9d9d9', padding: '3px 20px 3px 20px', margin: '10px 5px', position: 'relative' }}>
              <span>{this.props.filter.value}</span>
              {
                !this.state.updatingNPSFIlters ? (
                  <i className="material-icons" role="button" tabIndex={0} onClick={this.onDeleteNPSFilter} style={{ margin: '0 0 0 10px', position: 'relative', right: -10 }}>close</i>
                ) : (
                  <div style={{ margin: '0 0 0 10px', position: 'relative', right: -10 }}>
                    <Spinner spinnerColor="#808285" size={25} spinnerWidth={3} />
                  </div>
                )
              }
            </div>
          ) : (
            <div role="button" tabIndex={0} onClick={this.onAddNPSFilter} className={`nps-dimension-pill negative ${this.props.appliedNPSFIlters.find((appliedFilter) => appliedFilter.value === this.props.filter) ? 'inactive' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30, borderRadius: 15, border: 'solid 1px #d9d9d9', padding: '3px 15px', margin: '10px 5px', ...this.props.appliedNPSFIlters.find((appliedFilter) => appliedFilter.value === this.props.filter) ? { pointerEvents: 'none' } : {} }}>
              <span style={{ fontSize: 11 }}>{this.props.filter}</span>
              {
                this.state.updatingNPSFIlters ? (
                  <div style={{ margin: '0 0 0 10px' }}>
                    <Spinner spinnerColor="#808285" size={15} spinnerWidth={2} />
                  </div>
                ) : (
                  <i className="material-icons" style={{ margin: '0 0 0 10px' }}>add</i>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default NPSDimensionPill;
