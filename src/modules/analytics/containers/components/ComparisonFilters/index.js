/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component } from "react";
import "react-input-range/lib/css/index.css";
import moment from "moment";
import PropTypes from "prop-types";

import RadioComponent from "Modules/customers/containers/Customers/Actions/Filters/RadioComponent";
import SelectComponent from "Modules/customers/containers/Customers/Actions/Filters/SelectComponent";
import ActionDropdownDialog from "SharedComponents/action-dropdown-dialog";
import DateRangePicker from "SharedComponents/date-range-picker";
import IconButton from "SharedComponents/icon-button";
import ActionButton from "SharedComponents/action-button-styled";
import Accordion from "SharedComponents/mwamba-accordion/Accordion";

const dateRanges = [
  {
    id: 1,
    label: "Today",
    value: {
      from: moment()
        .startOf("day")
        .format(),
      to: moment()
        .endOf("day")
        .format(),
      label: "Today"
    }
  },
  {
    id: 2,
    label: "Last 7 Days",
    value: {
      from: moment()
        .subtract(7, "days")
        .startOf("day")
        .format(),
      to: moment()
        .endOf("day")
        .format(),
      label: "Last 7 Days"
    }
  },
  {
    id: 3,
    label: "Last 30 Days",
    value: {
      from: moment()
        .subtract(30, "days")
        .startOf("day")
        .format(),
      to: moment()
        .endOf("day")
        .format(),
      label: "Last 30 Days"
    }
  },
  {
    id: 4,
    label: "Last 60 Days",
    value: {
      from: moment()
        .subtract(60, "days")
        .startOf("day")
        .format(),
      to: moment()
        .endOf("day")
        .format(),
      label: "Last 60 Days"
    }
  },
  { id: 5, label: "Custom Range", dialogTrigger: true, value: {} }
];

export default class ComparisonFilters extends Component {
  static propTypes = {
    onCloseSidePanel: PropTypes.func,
    appliedFilters: PropTypes.object,
    applyFilters: PropTypes.func,
    windowDimensions: PropTypes.object
  };

  constructor(props) {
    super(props);

    const { appliedFilters } = props;

    this.state = {
      appliedFilters: JSON.parse(appliedFilters) || [],
      isApplyingFilters: false,
      selectedComparisonOption: null,
      comparisonOptions: {
        name: "comparisonOptions",
        filterType: "RADIO",
        options: ["Segments", "Locations"],
        maxValue: null,
        minValue: null
      },
      segments: {
        name: "segments",
        filterType: "SELECT",
        options: ["Segment A", "Segment B", "Segment C"],
        maxValue: null,
        minValue: null
      },
      locations: {
        name: "locations",
        filterType: "SELECT",
        options: ["Nairobi", "Kitui", "Machakos", "Thika", "Mombasa"],
        maxValue: null,
        minValue: null
      },
      selectedDateRange: dateRanges[2].value,
      scrollLeft: 0
    };

    this.ComparisonRef = React.createRef();
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onClearFilter = this.onClearFilter.bind(this);
    this.sentenseCase = this.sentenseCase.bind(this);
  }

  componentDidMount() {
    const { appliedFilters } = this.props;
    if (appliedFilters) {
      this.setState({ appliedFilters: JSON.parse(appliedFilters) });
    }
  }

  onRadioChange({ name, value }) {
    const { appliedFilters } = this.state;
    const values = Array.isArray(value) ? value : [value];
    const filterIndex = appliedFilters.findIndex(item => item.name === name);
    if (filterIndex !== -1) {
      appliedFilters[filterIndex] = {
        ...appliedFilters[filterIndex],
        options: values
      };
    } else {
      appliedFilters.push({
        name,
        filterType: "RADIO",
        options: values,
        maxValue: null,
        minValue: null
      });
    }
    console.log(value);
    this.setState({ appliedFilters, selectedComparisonOption: value });
  }

  onCheckboxChange({ name, value }) {
    if (!value.length) {
      this.onClearFilter(name);
    } else {
      const { appliedFilters } = this.state;
      const filterIndex = appliedFilters.findIndex(item => item.name === name);
      if (filterIndex !== -1) {
        appliedFilters[filterIndex] = {
          ...appliedFilters[filterIndex],
          options: value
        };
      } else {
        appliedFilters.push({
          name,
          filterType: "SELECT",
          options: value,
          maxValue: null,
          minValue: null
        });
      }
      this.setState({ appliedFilters });
    }
  }

  onSelectChange(name, value) {
    const { appliedFilters } = this.state;
    const filterIndex = appliedFilters.findIndex(item => item.name === name);
    if (filterIndex !== -1) {
      appliedFilters[filterIndex] = {
        ...appliedFilters[filterIndex],
        options: value
      };
    } else {
      appliedFilters.push({
        name,
        filterType: "SELECT",
        options: value,
        maxValue: null,
        minValue: null
      });
    }
    this.setState({ appliedFilters });
  }

  onRangeChange(name, value) {
    const { appliedFilters } = this.state;
    const filterIndex = appliedFilters.findIndex(item => item.name === name);
    if (filterIndex !== -1) {
      appliedFilters[filterIndex] = {
        ...appliedFilters[filterIndex],
        options: [],
        minValue: value.min,
        maxValue: value.max
      };
    } else {
      appliedFilters.push({
        name,
        filterType: "RANGE",
        options: [],
        minValue: value.min,
        maxValue: value.max
      });
    }
    this.setState({ appliedFilters });
  }

  onChangeDateRange(selectedDateRange) {
    this.setState({
      selectedDateRange: selectedDateRange.value
        ? selectedDateRange.value
        : selectedDateRange
    });
  }

  onApplyFilters() {
    const { applyFilters } = this.props;
    const { appliedFilters } = this.state;
    this.setState({ isApplyingFilters: true });
    applyFilters(appliedFilters);
  }

  onClearFilter(name) {
    const { appliedFilters } = this.state;
    const filters = appliedFilters.filter(item => item.name !== name);
    this.setState({ appliedFilters: filters });
  }

  sentenseCase(str) {
    const newWord = str
      .replace(/([A-Z]+)/g, " $1")
      .replace(/([A-Z][a-z])/g, " $1");
    return newWord.charAt(0).toUpperCase() + newWord.slice(1);
  }

  render() {
    const { onCloseSidePanel, windowDimensions } = this.props;
    const {
      appliedFilters,
      isApplyingFilters,
      comparisonOptions,
      segments,
      locations,
      selectedDateRange,
      scrollLeft,
      selectedComparisonOption
    } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%"
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 1
          }}
        >
          <div
            style={{
              width: "100%",
              height: 63,
              backgroundColor: "#d9d9d9",
              position: "sticky",
              top: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "30px 10px 30px 20px",
              boxShadow: "0 0 7px rgba(0, 0, 0, 0.6)",
              zIndex: 100
            }}
          >
            <div
              style={{
                height: 18,
                margin: "16px 0 8px 0",
                color: "#4a4a4a",
                font: "300 18px/14px Roboto,sans-serif",
                letterSpacing: 0
              }}
            >
              Comparison Variables
            </div>
            <IconButton icon="close" onClick={onCloseSidePanel} />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            backgroundColor: "#fff",
            position: "relative"
          }}
          ref={this.ComparisonRef}
        >
          <div style={{ padding: "0 10px 0 10px" }}>
            <div style={{ padding: "20px 0 20px 0" }}>
              <Accordion
                allowMultipleOpen
                accordionStyle={{ marginBottom: 20 }}
              >
                <div label={this.sentenseCase(comparisonOptions.name)} isOpen>
                  <RadioComponent
                    filter={comparisonOptions}
                    selectedFilters={appliedFilters}
                    onRadioChange={this.onRadioChange}
                    onClearFilter={this.onClearFilter}
                  />
                </div>
                {selectedComparisonOption === "Segments" ? (
                  <div label={this.sentenseCase(segments.name)} isOpen>
                    <SelectComponent
                      filter={segments}
                      onSelectChange={this.onSelectChange}
                      filteredOptions={appliedFilters}
                      onClearFilter={this.onClearFilter}
                      style={{ menu: { position: "relative", top: 0 } }}
                    />
                  </div>
                ) : selectedComparisonOption === "Locations" ? (
                  <div label={this.sentenseCase(locations.name)} isOpen>
                    <SelectComponent
                      filter={locations}
                      onSelectChange={this.onSelectChange}
                      filteredOptions={appliedFilters}
                      onClearFilter={this.onClearFilter}
                      style={{ menu: { position: "relative", top: 0 } }}
                    />
                  </div>
                ) : (
                  <div isOpen>No comparison option selected</div>
                )}
              </Accordion>
              <ActionDropdownDialog
                title={selectedDateRange.label}
                options={dateRanges}
                onChange={this.onChangeDateRange}
                scrollLeft={scrollLeft}
                parent={this.ComparisonRef}
                windowDimensions={windowDimensions}
                closeOnSelect
                clearFeed
                position="relative"
                top={-25}
                dialogComponent={<DateRangePicker range={selectedDateRange} />}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: "#ffffff",
              position: "relative",
              bottom: 0,
              paddingBottom: 10,
              zIndex: 2
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "inherit",
                width: "inherit",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ActionButton
                onClick={this.onApplyFilters}
                disabled={isApplyingFilters}
                loading={isApplyingFilters}
                icon="compare"
                text="Compare"
                style={{
                  backgroundColor: "#002366",
                  color: "#fff",
                  width: 200,
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                  borderRadius: 5
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
