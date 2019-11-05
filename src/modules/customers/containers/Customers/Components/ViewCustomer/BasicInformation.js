/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';

import IconButton from 'SharedComponents/icon-button';
import HorizontalContentScroller from 'SharedComponents/horizontal-content-scroller';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class BasicInformation extends Component {
  static propTypes = {
    width: PropTypes.number,
    participant: PropTypes.object,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.scroller = React.createRef();

    this.state = {
      left: 0,
    };

    this.onScrollLeft = this.onScrollLeft.bind(this);
    this.onScrollRight = this.onScrollRight.bind(this);
  }

  onScrollLeft() {
    if (this.scroller) {
      let { left } = this.state;

      this.scroller.current.scrollLeft -= this.scroller.current.offsetWidth;

      left = this.scroller.current.scrollLeft - this.scroller.current.offsetWidth;

      this.setState({ left });
    }
  }

  onScrollRight() {
    if (this.scroller) {
      let { left } = this.state;

      left = this.scroller.current.scrollLeft + (this.scroller.current.offsetWidth * 2);

      this.scroller.current.scrollLeft += this.scroller.current.offsetWidth;

      this.setState({ left });
    }
  }

  render() {
    const { width, participant, loading, currency } = this.props;
    const { left } = this.state;
    return (
      loading ? (
        <div className="hide-scrollbars" style={{ width: '100%', display: 'flex', height: 100, borderBottom: '1px solid #dfdfdf', margin: 0, padding: 0, backgroundColor: '#ffffff' }}>
          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RoundShape color="#d9d9d9" style={{ height: 50, width: 50 }} /></div>} />
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={(
                <div style={{ width: '100%', marginBottom: 5 }}>
                  <RectShape color="#d9d9d9" style={{ height: 20, marginBottom: 5, width: 200 }} />
                  <RectShape color="#d9d9d9" style={{ height: 20, width: 100 }} />
                </div>
              )}
            />
          </div>

          <div style={{ width: 1, margin: '25px 0', backgroundColor: '#dfdfdf' }}></div>

          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 50, width: 50 }} /></div>} />
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={(
                <div style={{ width: '100%', marginBottom: 5 }}>
                  <RectShape color="#d9d9d9" style={{ height: 20, marginBottom: 5, width: 200 }} />
                  <RectShape color="#d9d9d9" style={{ height: 20, width: 100 }} />
                </div>
              )}
            />
          </div>

          <div style={{ width: 1, margin: '25px 0', backgroundColor: '#dfdfdf' }}></div>

          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 50, width: 50 }} /></div>} />
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={(
                <div style={{ width: '100%', marginBottom: 5 }}>
                  <RectShape color="#d9d9d9" style={{ height: 20, marginBottom: 5, width: 200 }} />
                  <RectShape color="#d9d9d9" style={{ height: 20, width: 100 }} />
                </div>
              )}
            />
          </div>

          <div style={{ width: 1, margin: '25px 0', backgroundColor: '#dfdfdf' }}></div>

          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 50, width: 50 }} /></div>} />
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={(
                <div style={{ width: '100%', marginBottom: 5 }}>
                  <RectShape color="#d9d9d9" style={{ height: 20, marginBottom: 5, width: 200 }} />
                  <RectShape color="#d9d9d9" style={{ height: 20, width: 100 }} />
                </div>
              )}
            />
          </div>

          <div style={{ width: 1, margin: '25px 0', backgroundColor: '#dfdfdf' }}></div>

          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 50, width: 50 }} /></div>} />
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={(
                <div style={{ width: '100%', marginBottom: 5 }}>
                  <RectShape color="#d9d9d9" style={{ height: 20, marginBottom: 5, width: 200 }} />
                  <RectShape color="#d9d9d9" style={{ height: 20, width: 100 }} />
                </div>
              )}
            />
          </div>
        </div>
      ) : (
        <HorizontalContentScroller style={{ height: 100, borderBottom: '1px solid #dfdfdf', position: 'inherit' }}>
          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <div
              style={{
                margin: '0 10px', height: 40, width: 60, minWidth: 60, minHeight: 60, borderRadius: 30, fontSize: 18, backgroundColor: stringToHexColor(`${participant.firstName} ${participant.lastName}`).backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stringToHexColor(`${participant.firstName} ${participant.lastName}`).color,
              }}
            >
              {extractInitials(`${participant.firstName} ${participant.lastName}`)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 5 }}>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', fontWeight: 600, fontSize: 16,
                  }}
                >
                  {participant.firstName}
                  &nbsp;
                  {participant.lastName}
                </span>
              </div>
              <div>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
                  }}
                >
                  {participant.region}
                </span>
              </div>
            </div>
          </div>

          <div style={{ width: 1, margin: '25px 0', backgroundColor: '#dfdfdf' }}></div>

          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <div style={{ marginRight: 10 }}>
              <i className="material-icons" style={{ color: '#fd9681', fontSize: 46 }}>sentiment_very_dissatisfied</i>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 5 }}>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', fontWeight: 600, fontSize: 16,
                  }}
                >
                  {participant.npsScore}
                </span>
              </div>
              <div>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
                  }}
                >
                  Average NPS Score
                </span>
              </div>
            </div>
          </div>

          <div style={{ width: 1, margin: '25px 0', backgroundColor: '#dfdfdf' }}></div>

          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <div style={{ marginRight: 10 }}>
              <i className="material-icons" style={{ fontSize: 46, color: '#6D6E71' }}>location_city</i>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 5 }}>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', fontWeight: 600, fontSize: 16,
                  }}
                >
                  {participant.lastTransactionLocation}
                </span>
              </div>
              <div>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
                  }}
                >
                  Last Transaction Location
                </span>
              </div>
            </div>
          </div>

          <div style={{ width: 1, margin: '25px 0', backgroundColor: '#dfdfdf' }}></div>

          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <div style={{ marginRight: 10 }}>
              <i className="material-icons" style={{ fontSize: 46, color: '#6D6E71' }}>attach_money</i>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 5 }}>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', fontWeight: 600, fontSize: 16,
                  }}
                >
                  {currency}
                &nbsp;
                  {numeral(participant.lastTransactionSpent).format('0,0')}
                </span>
              </div>
              <div>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
                  }}
                >
                  Last Transaction Spend
                </span>
              </div>
            </div>
          </div>

          <div style={{ width: 1, margin: '25px 0', backgroundColor: '#dfdfdf' }}></div>

          <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 300, padding: 10 }}>
            <div style={{ marginRight: 10 }}>
              <i className="material-icons" style={{ fontSize: 46, color: '#6D6E71' }}>attach_money</i>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 5 }}>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', fontWeight: 600, fontSize: 16,
                  }}
                >
                {currency}
                &nbsp;
                  {numeral(participant.averageTransactionSpend).format('0,0')}
                </span>
              </div>
              <div>
                <span
                  style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
                  }}
                >
                  Average Spend
                </span>
              </div>
            </div>
          </div>
        </HorizontalContentScroller>
      )
    );
  }
}
