/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import NPSSelect from 'Modules/voc/containers/Home/components/nps-card/nps-select';

export default class NPSFilters extends Component {
  static propTypes = {
    npsMetaDataFilters: PropTypes.object,
    setNPSFilters: PropTypes.func,
    isFetchingData: PropTypes.bool,
    nps: PropTypes.object,
    title: PropTypes.string,
    npsMetadataFilters: PropTypes.object,
    isFetchingNPS: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      npsFilters: {},
    };

    this.onNPSFiltersChanged = this.onNPSFiltersChanged.bind(this);
  }

  componentWillReceiveProps(nextState) {
    const { npsMetaDataFilters, nps } = this.props;
    if (npsMetaDataFilters !== nextState.npsMetaDataFilters && !npsMetaDataFilters) {
      const npsFilters = {};
      if (nps) {
        // eslint-disable-next-line react/destructuring-assignment
        Object.keys(this.props.npsMetadataFilters).forEach((key) => {
          npsFilters[key] = null;
        });
      }

      this.setState({ npsFilters });
    }
  }

  onNPSFiltersChanged(filter, value) {
    const { npsFilters } = this.state;
    const { setNPSFilters } = this.props;
    const filters = { ...npsFilters, [filter]: value };
    this.setState({ npsFilters: filters }, () => {
      setNPSFilters(filters);
    });
  }

  render() {
    const { npsMetaDataFilters, isFetchingNPS, isFetchingData, title } = this.props;

    if (isFetchingData) {
      return (
        <div>
          <div style={{ width: '100%', margin: '10px 0 0 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
          </div>
          <Divider key="divider" />
        </div>
      );
    }

    return (
      <div style={{ width: '100%' }}>
        {Object.keys(npsMetaDataFilters || {}).length > 0 ? (
          <div style={{ width: '100%', margin: '10px 0 0 0' }}>
            <div style={{ margin: 0, width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }} key="filters">
              {title ? (<span><b style={{ fontSize: 14, color: '#6d6e71' }}>Net Promoter Score</b>&nbsp;&nbsp;</span>) : null}
              {
                Object.keys(npsMetaDataFilters).map((filter, i) => (
                  <NPSSelect filter={filter} menu={filter} options={npsMetaDataFilters[filter]} onChange={this.onNPSFiltersChanged} key={i} />
                ))
              }
            </div>
            <Divider key="divider" />
          </div>
        ) : null}

        {isFetchingNPS ? (
          <div style={{ position: 'relative', top: 5 }}>
            <Spinner spinnerColor="#487db3" size={15} spinnerWidth={2} />
          </div>
        ) : null}
      </div>
    );
  }
}
