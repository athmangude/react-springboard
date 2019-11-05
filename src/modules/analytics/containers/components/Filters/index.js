/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { PureComponent } from 'react';
import 'react-input-range/lib/css/index.css';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import { connect } from 'react-redux';

import RangeComponent from './RangeComponent';
import RadioComponent from './RadioComponent';
import CheckboxComponent from './CheckboxComponent';
import SelectComponent from './SelectComponent';
import IconButton from 'SharedComponents/icon-button';
import ActionButton from 'SharedComponents/action-button-styled';
import Accordion from 'SharedComponents/mwamba-accordion/Accordion';

@connect((state) => ({
  filters: state.customerAnalytics.filters,
}), () => ({}))

export default class Filters extends PureComponent {
  static propTypes = {
    filters: PropTypes.number,
    onCloseSidePanel: PropTypes.func,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    appliedFilters: PropTypes.object,
    applyFilters: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const { appliedFilters } = props;

    this.state = {
      appliedFilters: JSON.parse(appliedFilters) !== null ? JSON.parse(appliedFilters) : [],
      isLoadingFilters: false,
      isApplyingFilters: false,
    };

    this.onSelectChange = this.onSelectChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.fetchFilters = this.fetchFilters.bind(this);
    this.onClearFilter = this.onClearFilter.bind(this);
    this.isFilterSet = this.isFilterSet.bind(this);
  }

  componentDidMount() {
    const { filters } = this.props;
    if (!filters.length) {
      this.fetchFilters();
    }
  }

  onRadioChange({ name, value }) {
    const { appliedFilters } = this.state;
    const values = Array.isArray(value) ? value : [value];
    const filterIndex = appliedFilters.findIndex((item) => item.name === name);
    if (filterIndex !== -1) {
      appliedFilters[filterIndex] = { ...appliedFilters[filterIndex], options: values };
    } else {
      appliedFilters.push({ name, filterType: 'RADIO', options: values, maxValue: null, minValue: null });
    }
    this.setState({ appliedFilters });
  }

  onCheckboxChange({ name, value }) {
    if (!value.length) {
      this.onClearFilter(name);
    } else {
      const { appliedFilters } = this.state;
      const filterIndex = appliedFilters.findIndex((item) => item.name === name);
      if (filterIndex !== -1) {
        appliedFilters[filterIndex] = { ...appliedFilters[filterIndex], options: value };
      } else {
        appliedFilters.push({ name, filterType: 'SELECT', options: value, maxValue: null, minValue: null });
      }
      this.setState({ appliedFilters });
    }
  }

  onSelectChange(name, value) {
    const { appliedFilters } = this.state;
    const filterIndex = appliedFilters.findIndex((item) => item.name === name);
    if (filterIndex !== -1) {
      appliedFilters[filterIndex] = { ...appliedFilters[filterIndex], options: value };
    } else {
      appliedFilters.push({ name, filterType: 'SELECT', options: value, maxValue: null, minValue: null });
    }
    this.setState({ appliedFilters });
  }

  onRangeChange(name, value) {
    const { appliedFilters } = this.state;
    const filterIndex = appliedFilters.findIndex((item) => item.name === name);
    if (filterIndex !== -1) {
      appliedFilters[filterIndex] = { ...appliedFilters[filterIndex], options: [], minValue: value.min, maxValue: value.max };
    } else {
      appliedFilters.push({ name, filterType: 'RANGE', options: [], minValue: value.min, maxValue: value.max });
    }
    this.setState({ appliedFilters });
  }

  onApplyFilters() {
    const { applyFilters } = this.props;

    const { appliedFilters } = this.state;

    this.setState({ isApplyingFilters: true });
    applyFilters(appliedFilters);
  }

  onClearFilter(name) {
    const { appliedFilters } = this.state;

    const filters = appliedFilters.filter((item) => item.name !== name);

    this.setState({ appliedFilters: filters }, () => this.onApplyFilters());
  }

  isFilterSet(filter) {
    const { appliedFilters } = this.state;

    const filters = (appliedFilters.length) ? appliedFilters.find((selectedFilter) => selectedFilter.name === filter.name) : false;

    if (filters) return true;

    return false;
  }

  sentenseCase(value) {
    const newWord = value.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
    return newWord.charAt(0).toUpperCase() + newWord.slice(1);
  }

  async fetchFilters() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    this.setState({ isLoadingFilters: true });

    try {
      const fetchFiltersResult = await customerAnalyticsActions.fetchFilters();
      const filters = fetchFiltersResult.data.Data.filter((filter) => {
        if (filter.filterType === 'SELECT' && filter.options === null) {
          return null;
        } if (filter.filterType === 'SELECT' && !filter.options.length) {
          return null;
        }
        return filter;
      });
      customerAnalyticsActions.setFilters(filters.filter((filter) => !['location', 'county'].includes(filter.name)));
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingFilters: false });
    }
  }

  render() {
    const { onCloseSidePanel, filters } = this.props;
    const { isLoadingFilters, appliedFilters, isApplyingFilters } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
        <div style={{ width: '100%', backgroundColor: '#fff', position: 'relative' }}>
          <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)', zIndex: 100 }}>
            <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>More Filters</h2>
            <IconButton icon="close" onClick={onCloseSidePanel} />
          </div>
        </div>
        {
          filters.length ? (
            <div style={{ width: '100%', backgroundColor: '#fff', position: 'relative' }}>
              <div style={{ padding: '0 10px 0 10px' }}>
                <div style={{ padding: '20px 0 20px 0' }}>
                  <Accordion allowMultipleOpen accordionStyle={{ marginBottom: 20 }}>
                    {
                      filters.map((filter) => (
                        <div label={this.sentenseCase(filter.name)} isOpen={this.isFilterSet(filter)}>
                          {
                            filter.filterType === 'RANGE' ? (
                              <RangeComponent filter={filter} selectedFilters={appliedFilters} onRangeChange={this.onRangeChange} onClearFilter={this.onClearFilter} />
                            ) : filter.filterType === 'RADIO' ? (
                              <RadioComponent filter={filter} selectedFilters={appliedFilters} onRadioChange={this.onRadioChange} onClearFilter={this.onClearFilter} />
                            ) : filter.filterType === 'SELECT' && filter.options !== null && filter.options.length <= 5 ? (
                              <CheckboxComponent filter={filter} selectedFilters={appliedFilters} onCheckboxChange={this.onCheckboxChange} onClearFilter={this.onClearFilter} />
                            ) : filter.filterType === 'SELECT' ? (
                              <SelectComponent filter={filter} onSelectChange={this.onSelectChange} filteredOptions={appliedFilters} onClearFilter={this.onClearFilter} />
                            ) : (
                              <div>
                                Unsupported type:
                                &nbsp;
                                {filter.filterType}
                              </div>
                            )
                          }
                        </div>
                      ))
                    }
                  </Accordion>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: '#ffffff', position: 'sticky', bottom: 0, paddingBottom: 10, zIndex: 2 }}>
                <ActionButton onClick={this.onApplyFilters} loading={isApplyingFilters} icon="filter_list" text="Filter" style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
              </div>
            </div>
          ) : isLoadingFilters ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
              <span style={{ margin: 20 }}>Fetching customer filters...</span>
            </div>
          ) : !filters.length ? (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', flexDirection: 'column', marginBottom: '20px', marginTop: '20px' }}>
              <span style={{ textAlign: 'center' }}>
                We could not find any filters.
              </span>
              <ActionButton onClick={this.fetchFilters} icon="refresh" text="Try Again" style={{ backgroundColor: '#487db3', color: '#fff', height: 30, borderRadius: 25, marginTop: '20px' }} />
            </div>
          ) : null
        }
      </div>
    );
  }
}
