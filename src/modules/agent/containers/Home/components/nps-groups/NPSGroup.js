/* eslint-disable no-nested-ternary, no-return-assign, jsx-a11y/interactive-supports-focus */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import scrollToComponent from 'react-scroll-to-component';

import Feedback from '../feedback';
import ActionButton from 'SharedComponents/action-button';
import MultiSelect from 'Utils/multi-select';
import IconButton from 'SharedComponents/icon-button';

export default class NPSGroup extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    collaborators: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    homeActions: PropTypes.object.isRequired,
    isFetchingPromoterComments: PropTypes.bool.isRequired,
    isFetchingPassiveComments: PropTypes.bool.isRequired,
    isFetchingDetractorComments: PropTypes.bool.isRequired,
    fetchNPSComments: PropTypes.func.isRequired,
    npsFilters: PropTypes.object.isRequired,
    configurations: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onToggleExpanded = this.onToggleExpanded.bind(this);
    this.onScrollBackToTop = this.onScrollBackToTop.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
    this.onSelectOptionsChanged = this.onSelectOptionsChanged.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  state = {
    isExpanded: false,
    fetchOptions: {
      read: false,
      bookmarked: false,
    },
  }

  onToggleExpanded() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  onCollapse() {
    this.setState({ isExpanded: false });
    this.onScrollBackToTop();
  }

  onRefresh(event) {
    event.stopPropagation();

    if (this.props.type === 'passives') {
      this.props.fetchNPSComments('passives', { read: false, category: 'passives', offset: 0, ...this.props.npsFilters, ...this.state.fetchOptions }, true);
    }

    if (this.props.type === 'promoters') {
      this.props.fetchNPSComments('promoters', { read: false, category: 'promoters', offset: 0, ...this.props.npsFilters, ...this.state.fetchOptions }, true);
    }

    if (this.props.type === 'detractors') {
      this.props.fetchNPSComments('detractors', { read: false, category: 'detractors', offset: 0, ...this.props.npsFilters, ...this.state.fetchOptions }, true);
    }
  }

  onSelectOptionsChanged(property, value) {
    this.setState({ fetchOptions: { ...this.state.fetchOptions, [property]: value } });
  }

  onScrollBackToTop() {
    scrollToComponent(this.top, {
      duration: 1000,
      offset: -100,
      align: 'top',
    });
  }

  render() {
    const selectOptions = Object.keys(this.state.fetchOptions).map((key) => ({ label: key, selected: this.state.fetchOptions[key] }));
    const items = this.props.items.filter((item) => !!item.npsComment);

    let sentiment;
    if (this.props.type === 'promoters') {
      sentiment = 'promoter';
    }

    if (this.props.type === 'passives') {
      sentiment = 'passive';
    }

    if (this.props.type === 'detractors') {
      sentiment = 'detractor';
    }

    if (!items.length) {
      return (
        <div ref={(div) => this.top = div} id={this.props.id} style={{ width: '100%', margin: '5px 0 10px', border: 'solid 1px #d9d9d9', borderRadius: 8, backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: '#fff', borderTopRightRadius: 8, borderTopLeftRadius: 8, padding: '5px 10px', cursor: 'pointer', ...this.props.type === 'detractors' ? { backgroundColor: '#fd9681' } : this.props.type === 'passives' ? { backgroundColor: '#fcda6e' } : { backgroundColor: '#80c582' } }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 10 }}>
            <span>You have read all {sentiment} feedback</span>
            {
              this.props.type === 'promoters' ? (
                <ActionButton text={!this.props.isFetchingPromoterComments ? 'Check for more' : 'Checking for more'} large icon="history" loading={this.props.isFetchingPromoterComments} disabled={this.props.isFetchingPromoterComments} onClick={() => this.props.fetchNPSComments('promoters', { read: false, category: 'promoters', offset: this.props.items.length })} />
              ) : this.props.type === 'passives' ? (
                <ActionButton text={!this.props.isFetchingPassiveComments ? 'Check for more' : 'Checking for more'} large icon="history" loading={this.props.isFetchingPassiveComments} disabled={this.props.isFetchingPassiveComments} onClick={() => this.props.fetchNPSComments('passives', { read: false, category: 'passives', offset: this.props.items.length })} />
              ) : <ActionButton text={!this.props.isFetchingDetractorComments ? 'Check for more' : 'Checking for more'} large icon="history" loading={this.props.isFetchingDetractorComments} disabled={this.props.isFetchingDetractorComments} onClick={() => this.props.fetchNPSComments('detractors', { read: false, category: 'detractors', offset: this.props.items.length })} />
            }
          </div>
        </div>
      );
    }

    return (
      <div ref={(div) => this.top = div} id={this.props.id} style={{ width: '100%', margin: '5px 0 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
          <div onClick={this.onToggleExpanded} role="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', color: this.props.type !== 'passives' ? '#fff' : '#6d6e71', borderRadius: 5, padding: '5px 10px', cursor: 'pointer', ...this.props.type === 'detractors' ? { backgroundColor: '#fd9681' } : this.props.type === 'passives' ? { backgroundColor: '#fcda6e' } : { backgroundColor: '#80c582' }, ...this.state.isExpanded ? { position: 'sticky', top: 57, zIndex: 1, width: 'calc(100% + 20px)', borderTopLeftRadius: 3, borderTopRightRadius: 3 } : { } }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <i className="material-icons">{this.props.type === 'promoters' ? 'sentiment_satisfied' : this.props.type === 'passives' ? 'sentiment_neutral' : 'sentiment_very_dissatisfied' }</i>&nbsp;&nbsp;
              {
                this.state.isExpanded ? (
                  <span>{`Hide ${items.length - 1} ${sentiment} ${items.length - 1 === 1 ? 'comment' : 'comments'}`}</span>
                ) : (
                  <span>{`See ${items.length - 1} more ${sentiment} ${items.length - 1 === 1 ? 'comment' : 'comments'}`}</span>
                )
              }
            </div>
            <div>
              {
                this.state.isExpanded ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <MultiSelect title="Options" options={selectOptions} onChange={this.onSelectOptionsChanged} />
                    {
                      this.props.type === 'detractors' ? (
                        <IconButton icon="refresh" onClick={this.onRefresh} loading={this.props.isFetchingDetractorComments} disabled={this.props.isFetchingDetractorComments} />
                      ) : this.props.type === 'passives' ? (
                        <IconButton icon="refresh" onClick={this.onRefresh} loading={this.props.isFetchingPassiveComments} disabled={this.props.isFetchingPassiveComments} />
                      ) : (
                        <IconButton icon="refresh" onClick={this.onRefresh} loading={this.props.isFetchingPromoterComments} disabled={this.props.isFetchingPromoterComments} />
                      )
                    }
                    <IconButton onClick={this.onToggleExpanded} icon="unfold_less" style={{ margin: 0, color: this.props.type !== 'passives' ? '#fff' : '#6d6e71' }} />
                  </div>
                ) : (
                  <IconButton onClick={this.onToggleExpanded} icon="unfold_more" style={{ margin: 0, color: this.props.type !== 'passives' ? '#fff' : '#6d6e71' }} />
                )
              }
            </div>
          </div>
          {
            !this.state.isExpanded ? (
              <Feedback comment={items[0]} collaborators={this.props.collaborators} configurations={this.props.configurations} homeActions={this.props.homeActions} />
            ) : (
              <div style={{ width: '100%' }}>
                {
                  items.map((item) => (<Feedback comment={item} collaborators={this.props.collaborators} configurations={this.props.configurations} homeActions={this.props.homeActions} />))
                }
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                  <ActionButton text="Collapse" large icon="unfold_less" onClick={this.onCollapse} />
                  <ActionButton text="Back&nbsp;to&nbsp;top" large icon="arrow_upward" onClick={this.onScrollBackToTop} />
                  {
                    this.props.type === 'promoters' ? (
                      <ActionButton text="Load&nbsp;More" large icon="history" loading={this.props.isFetchingPromoterComments} disabled={this.props.isFetchingPromoterComments} onClick={() => this.props.fetchNPSComments('promoters', { read: false, category: 'promoters', offset: this.props.items.length, ...this.props.npsFilters, ...this.state.fetchOptions })} />
                    ) : this.props.type === 'passives' ? (
                      <ActionButton text="Load&nbsp;More" large icon="history" loading={this.props.isFetchingPassiveComments} disabled={this.props.isFetchingPassiveComments} onClick={() => this.props.fetchNPSComments('passives', { read: false, category: 'passives', offset: this.props.items.length, ...this.props.npsFilters, ...this.state.fetchOptions })} />
                    ) : <ActionButton text="Load&nbsp;More" large icon="history" loading={this.props.isFetchingDetractorComments} disabled={this.props.isFetchingDetractorComments} onClick={() => this.props.fetchNPSComments('detractors', { read: false, category: 'detractors', offset: this.props.items.length, ...this.props.npsFilters, ...this.state.fetchOptions })} />
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
