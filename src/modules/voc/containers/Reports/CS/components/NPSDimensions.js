/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Dropdown, Loader } from 'semantic-ui-react';
import { Col } from 'react-grid-system';
import orderBy from 'lodash/orderBy';

import IconButton from 'SharedComponents/icon-button';
import './index.css';

class NPSDimensions extends Component {
  constructor(props) {
    super(props);
    const orderedDimensions = orderBy(props.dimensions, ['responses'], ['desc']).filter((dimension) => dimension.responses > 0);

    this.state = {
      defaultDisplay: 10,
      display: 10,
      orderedDimensions,
      show: 'less',
      sort: { column: 'responses', order: 'desc' },
    };

    this.showMore = this.showMore.bind(this);
    this.showLess = this.showLess.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { dimensions } = this.props;
    const { sort } = this.state;
    if (newProps.dimensions !== dimensions) {
      const orderedDimensions = orderBy(newProps.dimensions, [sort.column], [sort.column.order]).filter((dimension) => dimension.responses > 0);
      this.setState({
        orderedDimensions,
      });
    }
  }

  showMore() {
    const { orderedDimensions } = this.state;
    this.setState({ show: 'more', display: orderedDimensions.length });
  }

  showLess() {
    const { defaultDisplay } = this.state;
    this.setState({ show: 'less', display: defaultDisplay });
  }

  toggleSort(column) {
    const { sort } = this.state;
    const { dimensions } = this.props;
    let order = 'desc'; // Default;

    if (sort.column === column) {
      if (sort.order === 'desc') {
        order = 'asc';
      }
    }

    const orderedDimensions = orderBy(dimensions, [column], [order]).filter((dimension) => dimension.responses > 0);
    this.setState({ orderedDimensions, sort: { column, order } });
  }

  render() {
    const { dimensionKeys, dimensionKey, onDimensionKeyChanged, isFetchingDimensionKeys, isFetchingDimensions } = this.props;
    const { orderedDimensions, display, show, sort } = this.state;
    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ marginBottom: 100, overflow: 'visible' }}>
        <div style={{ width: '100%', borderRadius: 8, boxShadow: '0 0px 0px 2px rgba(67, 70, 86, 0.1)', backgroundColor: '#ffffff', border: 'none', marginBottom: 20, padding: '20px 20px 0 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '100%', height: 15, fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#58595b' }}>DIMENSIONS</div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {isFetchingDimensions ? (<Loader active inline size="tiny" style={{ marginRight: 10 }} />) : null}
              <Dropdown
                name="dimensionKey"
                className="cs-touchpoints"
                inline
                loading={isFetchingDimensionKeys}
                defaultValue={dimensionKey}
                onChange={onDimensionKeyChanged}
                // eslint-disable-next-line react/jsx-one-expression-per-line
                trigger={<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 5 }}><i className="material-icons">filter_list</i> &nbsp;<span style={{ textTransform: 'capitalize', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dimensionKey}</span></div>}
                options={dimensionKeys.map((option) => ({
                  key: option.key,
                  value: option.key,
                  text: (<span style={{ textTransform: 'capitalize' }}>{option.key}</span>),
                  style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285', textTransform: 'capitalize !important' },
                }))}
                item
                style={{ width: '100%', height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285', textTransform: 'capitalize !important', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              />
            </div>
          </div>
          {orderedDimensions.length ? (
            <div className="hide-scroll-bar" style={{ width: '100%', overflowX: 'auto' }}>
              <Table singleLine style={{ border: 'none' }}>
                <Table.Header style={{ minHeight: 14, fontFamily: 'Lato', fontSize: 10, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5 }}>
                  <Table.Row>
                    <Table.HeaderCell onClick={() => this.toggleSort('value')} width={3} style={{ color: '#58595b', backgroundColor: '#ffffff', textTransform: 'uppercase' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {
                          sort.column === 'value' ? (
                            <i className="material-icons" style={{ transform: sort.order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)', marginRight: 5, fontSize: 15 }}>sort</i>
                          ) : null
                        }
                        <div style={{ textTransform: 'uppercase' }}>{dimensionKey}</div>
                      </div>
                    </Table.HeaderCell>
                    <Table.HeaderCell onClick={() => this.toggleSort('responses')} width={3} style={{ color: '#58595b', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {
                          sort.column === 'responses' ? (
                            <i className="material-icons" style={{ transform: sort.order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)', marginRight: 5, fontSize: 15 }}>sort</i>
                          ) : null
                        }
                        <div>RESPONSES</div>
                      </div>
                    </Table.HeaderCell>
                    <Table.HeaderCell onClick={() => this.toggleSort('npsScore')} width={3} style={{ color: '#58595b', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {
                          sort.column === 'npsScore' ? (
                            <i className="material-icons" style={{ transform: sort.order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)', marginRight: 5, fontSize: 15 }}>sort</i>
                          ) : null
                        }
                        <div style={{ textTransform: 'uppercase' }}>NPS SCORE</div>
                      </div>
                    </Table.HeaderCell>
                    <Table.HeaderCell onClick={() => this.toggleSort('detractors')} width={3} style={{ color: '#58595b', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {
                          sort.column === 'detractors' ? (
                            <i className="material-icons" style={{ transform: sort.order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)', marginRight: 5, fontSize: 15 }}>sort</i>
                          ) : null
                        }
                        <div style={{ textTransform: 'uppercase' }}>DETRACTORS</div>
                      </div>
                    </Table.HeaderCell>
                    <Table.HeaderCell onClick={() => this.toggleSort('passives')} width={3} style={{ color: '#58595b', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {
                          sort.column === 'passives' ? (
                            <i className="material-icons" style={{ transform: sort.order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)', marginRight: 5, fontSize: 15 }}>sort</i>
                          ) : null
                        }
                        <div style={{ textTransform: 'uppercase' }}>PASSIVES</div>
                      </div>
                    </Table.HeaderCell>
                    <Table.HeaderCell onClick={() => this.toggleSort('promoters')} width={3} style={{ color: '#58595b', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {
                          sort.column === 'promoters' ? (
                            <i className="material-icons" style={{ transform: sort.order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)', marginRight: 5, fontSize: 15 }}>sort</i>
                          ) : null
                        }
                        <div style={{ textTransform: 'uppercase' }}>PROMOTERS</div>
                      </div>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body style={{ fontFamily: 'Lato', fontSize: 10, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 3, letterSpacing: 0.5, color: '#808285' }}>
                  {orderedDimensions.slice(0, display).map((dimension) => {
                    const total = dimension.promoters + dimension.passives + dimension.detractors;
                    return (
                      <Table.Row key={dimension.value}>
                        <Table.Cell style={{ textTransform: 'uppercase' }}>{dimension.value}</Table.Cell>
                        <Table.Cell>{dimension.responses}</Table.Cell>
                        <Table.Cell>{dimension.npsScore}</Table.Cell>
                        <Table.Cell>
                          <div style={{ color: '#f26b50', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: 70 }}>
                            <i className="material-icons" style={{ fontSize: 20 }}>sentiment_dissatisfied</i>
                            <span>{Math.round((dimension.detractors / total) * 100) || 0}%</span>
                            <span>({dimension.detractors})</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div style={{ color: '#ffac28', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: 70 }}>
                            <i className="material-icons" style={{ fontSize: 20 }}>sentiment_satisfied</i>
                            <span>{Math.round((dimension.passives / total) * 100) || 0}%</span>
                            <span>({dimension.passives})</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div style={{ color: '#80c582', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: 70 }}>
                            <i className="material-icons" style={{ fontSize: 20 }}>sentiment_very_satisfied</i>
                            <span>{Math.round((dimension.promoters / total) * 100) || 0}%</span>
                            <span>({dimension.promoters})</span>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10 }}>
                {
                  show === 'less' ? (
                    <IconButton icon="expand_more" onClick={this.showMore} />
                  ) : null
                }
                {
                  show === 'more' ? (
                    <IconButton icon="expand_less" onClick={this.showLess} />
                  ) : null
                }
              </div>
            </div>
          ) : null}
        </div>
      </Col>
    );
  }
}

NPSDimensions.propTypes = {
  dimensions: PropTypes.array,
  dimensionKeys: PropTypes.array,
  dimensionKey: PropTypes.string,
  onDimensionKeyChanged: PropTypes.func,
  isFetchingDimensionKeys: PropTypes.bool,
  isFetchingDimensions: PropTypes.bool,
};

export default NPSDimensions;
