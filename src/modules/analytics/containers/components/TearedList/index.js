/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spinner from 'react-spinner-material';

import Title from '../Title';
import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import styles from './styles.css';
const TearedWrapper = styled.div`${styles}`;

export default class TearedList extends Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    hiddenItems: PropTypes.number,
    topComponent: PropTypes.object,
    bottomComponent: PropTypes.object,
    fullComponent: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.onShowMore = this.onShowMore.bind(this);
    this.onShowLess = this.onShowLess.bind(this);
    this.onPaginateNext = this.onPaginateNext.bind(this);
    this.onPaginatePrevious = this.onPaginatePrevious.bind(this);
  }

  state = {
    teared: true,
  }

  onShowMore() {
    this.setState({ teared: false });
  }

  onShowLess() {
    this.setState({ teared: true });
  }

  onPaginateNext() {
    const {onPaginateNext} = this.props;

    onPaginateNext();
  }

  onPaginatePrevious() {
    const {onPaginatePrevious} = this.props;

    onPaginatePrevious();
  }

  render() {
    const { title, subtitle, topComponent, bottomComponent, fullComponent, hiddenItems, isLoading, pagination } = this.props;
    const { teared } = this.state;
    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <div style={{ flex: 1, flexDirection: 'row', display: 'flex'}}>
          <div style={{ flex: 3, flexDirection: 'column', display: 'flex'}}>
            <Title title={title} subtitle={subtitle} />
          </div>
          <div style={{ flex: 1, flexDirection: 'column', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
            {
              (pagination && pagination.show) ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pagination.previous ? (<IconButton disabled={false} onClick={() => this.onPaginatePrevious()} icon="keyboard_arrow_left" style={{ margin: '0 5px 0 10px' }} />) : null}
                    {pagination.next ? (<IconButton disabled={false} onClick={() => this.onPaginateNext()} icon="keyboard_arrow_right" style={{ margin: '0 10px 0 5px' }} />) : null }
                  </div>
               ) : null
            }
          </div>
        </div>
        {
          isLoading ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10, paddingBottom: 10 }}>
              <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              </div>
            </div>
          ) : topComponent && bottomComponent && teared ? (
            <TearedWrapper>
              <div className="bottom-teared-container">
                <div className="teared-list">
                  {topComponent}
                </div>
              </div>
              <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', border: '1px solid #d1d5da', borderRadius: 3, padding: 10, zIndex: 1 }}>
                  <span style={{ marginBottom: 10, color: '#586069' }}>
                    {hiddenItems}
                    &nbsp;hidden items
                  </span>
                  <ActionButton icon="unfold_more" text="Show All" onClick={this.onShowMore} />
                </div>
              </div>
              <div className="top-teared-container">
                <div className="teared-list">
                  {bottomComponent}
                </div>
              </div>
            </TearedWrapper>
          ) : fullComponent ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10, paddingBottom: 10 }}>
              <div style={{ width: '100%', marginBottom: 10 }}>{fullComponent}</div>
              {
                hiddenItems > 0 ? (
                  <ActionButton icon="unfold_less" text="Show Less" onClick={this.onShowLess} />
                ) : null
              }
            </div>
          ) : (
            <div style={{ width: '100%', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>No items to show</div>
          )
        }
      </div>
    );
  }
}
