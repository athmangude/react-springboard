/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import Switch from 'react-switch';
import enhanceWithClickOutside from 'react-click-outside';

import ActionButton from 'SharedComponents/action-button-styled';

class NPSCategories extends Component {
  static propTypes = {
    nps: PropTypes.object.isRequired,
    windowDimensions: PropTypes.object.isRequired,
    feedFilters: PropTypes.object.isRequired,
    onFeedFiltersChanged: PropTypes.func.isRequired,
    isLoadingFeed: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
    };
    this.onToggleMenu = this.onToggleMenu.bind(this);
  }

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { onFeedFiltersChanged, feedFilters, isLoadingFeed, nps, windowDimensions } = this.props;
    const { menuOpen } = this.state;

    const options = [
      { key: 'detractors', property: 'detractors', label: 'Detractors', value: feedFilters.detractors, icon: 'sentiment_very_dissatisfied', color: '#fd9681' },
      { key: 'passives', property: 'passives', label: 'Passives', value: feedFilters.passives, icon: 'sentiment_neutral', color: '#fcda6e' },
      { key: 'promoters', property: 'promoters', label: 'Promoters', value: feedFilters.promoters, icon: 'sentiment_satisfied', color: '#80c582' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
        <div style={{ position: 'relative', margin: '2px 5px', width: 150 }}>
          {
            isLoadingFeed ? (
              <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
            ) : !menuOpen ? (
              <ActionButton icon="" text="NPS&nbsp;Categories" onClick={this.onToggleMenu} style={{ border: 'solid 1px #e2e4eb' }} />
            ) : (
              <div className="hide-scrollbars" style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: -10, left: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 200, overflowX: 'auto' }}>
                {
                  options.map((option) => (
                    <button
                      type="button"
                      style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '5px 0' }}
                      className="option"
                      key={option.key}
                      onClick={() => {
                        if (option.nullIsTrue) {
                          onFeedFiltersChanged({ [option.property]: !option.value ? null : false }, true);
                        } else {
                          onFeedFiltersChanged({ [option.property]: !option.value }, true);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Switch
                          checked={option.value}
                          onChange={(change) => onFeedFiltersChanged({ [option.property]: change }, true)}
                          onColor="#fc8384"
                          onHandleColor="#002366"
                          handleDiameter={15}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                          height={10}
                          width={24}
                          className="react-switch"
                          id="material-switch"
                        />
                        <span>&nbsp;&nbsp;</span>
                        <span style={{ textTransform: 'capitalize' }}>
                          {option.label}
                        </span>
                      </div>
                      {
                        option.icon ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <span>&nbsp;&nbsp;</span>
                            <i className="material-icons" style={{ color: option.color }}>{option.icon}</i>
                          </div>
                        ) : null
                      }
                    </button>
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default enhanceWithClickOutside(NPSCategories);
