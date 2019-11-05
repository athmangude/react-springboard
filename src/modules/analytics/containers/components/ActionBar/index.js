/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { PureComponent } from "react";
import styled from "styled-components";
import moment from "moment";
import PropTypes from "prop-types";
import Spinner from "react-spinner-material";

import ActionBarStyles from "./styles";

import Filters from "../Filters";
import TabMenu from "SharedComponents/tab";
import IconButton from "SharedComponents/icon-button";
import ActionDropdownDialog from "SharedComponents/action-dropdown-dialog";
import DateRangePicker from "SharedComponents/date-range-picker";
import SidePanel from "./SidePanel";

const ActionBarWrapper = styled.div`
  ${ActionBarStyles}
`;

const dateRanges = [
  {
    key: 1,
    label: "Today",
    value: {
      from: moment()
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      to: moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      label: "Today"
    }
  },
  {
    key: 2,
    label: "Last 7 Days",
    value: {
      from: moment()
        .subtract(7, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      to: moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      label: "Last 7 Days"
    }
  },
  {
    key: 3,
    label: "Last 30 Days",
    value: {
      from: moment()
        .subtract(30, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      to: moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      label: "Last 30 Days"
    }
  },
  {
    key: 4,
    label: "Last 60 Days",
    value: {
      from: moment()
        .subtract(60, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      to: moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      label: "Last 60 Days"
    }
  },
  { key: 5, label: "Custom Range", dialogTrigger: true, value: {} }
];

class ActionBar extends PureComponent {
  static propTypes = {
    windowDimensions: PropTypes.object,
    style: PropTypes.object,
    tabs: PropTypes.array,
    selectedTab: PropTypes.string,
    onTabSelected: PropTypes.func,
    onChangeDateRange: PropTypes.func,
    onChangeSegment: PropTypes.func,
    onApplyFilters: PropTypes.func,
    customerAnalyticsActions: PropTypes.object,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    customActions: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.ActionBarRef = React.createRef();
    this.onScroll = this.onScroll.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeCounty = this.onChangeCounty.bind(this);
    this.onChangeSegment = this.onChangeSegment.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.onViewFilters = this.onViewFilters.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.formatTitle = this.formatTitle.bind(this);
    this.fetchSegments = this.fetchSegments.bind(this);
  }

  state = {
    scrollLeft: 0,
    selectedLocation: {},
    selectedCounty: {},
    selectedSegment: {},
    selectedDateRange: dateRanges[2].value,
    isLoadingSegments: false,
    segments: [],
    isLoadingFilters: false,
    locations: [],
    counties: [],
    appliedFilters: [],
    sidePanel: null,
    showSidePanel: false
  };

  componentDidMount() {
    this.ActionBarRef.current.addEventListener("scroll", this.onScroll);
    this.fetchFilters();
    this.fetchSegments();
  }

  componentWillReceiveProps(newProps) {
    const { appliedFilters: newAppliedFilters } = newProps;
    const { appliedFilters } = this.state;
    if (JSON.stringify(newAppliedFilters) !== JSON.stringify(appliedFilters)) {
      this.setState({ appliedFilters: newAppliedFilters });
    }
  }

  componentWillUnmount() {
    this.ActionBarRef.current.removeEventListener("scroll", this.onScroll);
  }

  onScroll(event) {
    this.setState({ scrollLeft: event.target.scrollLeft });
  }

  onChangeLocation(selectedLocation) {
    const { onApplyFilters } = this.props;
    const { appliedFilters } = this.state;
    const name = "locations";

    const filterIndex = appliedFilters.findIndex(item => item.name === name);
    if (filterIndex !== -1) {
      appliedFilters[filterIndex] = {
        ...appliedFilters[filterIndex],
        options: [selectedLocation]
      };
    } else {
      appliedFilters.push({
        name,
        filterType: "SELECT",
        options: [selectedLocation],
        maxValue: null,
        minValue: null
      });
    }
    this.setState({ selectedLocation, appliedFilters }, () =>
      onApplyFilters(appliedFilters)
    );
  }

  onChangeCounty(selectedCounty) {
    const { onApplyFilters } = this.props;
    const { appliedFilters } = this.state;
    const name = "county";

    const filterIndex = appliedFilters.findIndex(item => item.name === name);
    if (filterIndex !== -1) {
      appliedFilters[filterIndex] = {
        ...appliedFilters[filterIndex],
        options: [selectedCounty]
      };
    } else {
      appliedFilters.push({
        name,
        filterType: "SELECT",
        options: [selectedCounty],
        maxValue: null,
        minValue: null
      });
    }
    this.setState({ selectedCounty, appliedFilters }, () =>
      onApplyFilters(appliedFilters)
    );
  }

  onChangeSegment(selectedSegment) {
    const { onChangeSegment } = this.props;
    this.setState({ selectedSegment }, () => onChangeSegment(selectedSegment));
  }

  onChangeDateRange(selectedDateRange) {
    const { onChangeDateRange } = this.props;
    const value = selectedDateRange.value
      ? selectedDateRange.value
      : selectedDateRange;
    this.setState({ selectedDateRange: value }, () => onChangeDateRange(value));
  }

  onViewFilters() {
    const {
      customerAnalyticsActions,
      alertActions,
      windowDimensions,
      EventHandler
    } = this.props;
    const { width } = windowDimensions;
    const { appliedFilters } = this.state;
    this.setState({
      showSidePanel: true,
      sidePanel: (
        <Filters
          appliedFilters={JSON.stringify(appliedFilters)}
          onCloseSidePanel={this.onCloseSidePanel}
          width={width}
          applyFilters={this.onApplyFilters}
          customerAnalyticsActions={customerAnalyticsActions}
          alertActions={alertActions}
          EventHandler={EventHandler}
        />
      )
    });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false, sidePanel: null });
  }

  onApplyFilters(appliedFilters) {
    const { onApplyFilters } = this.props;
    this.setState(
      { appliedFilters, showSidePanel: false, sidePanel: null },
      () => onApplyFilters(appliedFilters)
    );
  }

  formatTitle(label) {
    if (label && label.length) {
      return <span>{label.replace(/\s/g, "\u00A0")}</span>;
    }
    return null;
  }

  extractLocations(filters) {
    const options = [{ key: null, label: "All Locations" }];
    const location = filters.find(filter => filter.name === "location");
    if (location && location.options) {
      location.options
        .filter(option => {
          const matches = option.match(/\s/g);
          if (matches !== null && matches.length < 3) {
            // TODO Remove once data has been cleaned up on the API side
            return option;
          }
          return false;
        })
        .forEach(option => {
          options.push({ key: option.replace(/\s/g, "_"), label: option });
        });
    }
    this.setState({ locations: options, selectedLocation: options[0] });
  }

  extractCounties(filters) {
    const options = [{ key: null, label: "All Counties" }];
    const county = filters.find(filter => filter.name === "county");
    if (county && county.options) {
      county.options.forEach(option => {
        options.push({ key: option.replace(/\s/g, "_"), label: option });
      });
    }
    this.setState({ counties: options, selectedCounty: options[0] });
  }

  async fetchFilters() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    this.setState({ isLoadingFilters: true });

    try {
      const fetchFiltersResult = await customerAnalyticsActions.fetchFilters();
      const filters = fetchFiltersResult.data.Data.filter(filter => {
        if (filter.filterType === "SELECT" && filter.options === null) {
          return null;
        }
        if (filter.filterType === "SELECT" && !filter.options.length) {
          return null;
        }
        return filter;
      });

      this.extractLocations(filters);
      this.extractCounties(filters);
      customerAnalyticsActions.setFilters(
        filters.filter(filter => !["location", "county"].includes(filter.name))
      );
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingFilters: false });
    }
  }

  async fetchSegments() {
    const { customerAnalyticsActions, EventHandler } = this.props;
    const { limit, offset } = this.state;
    this.setState({ isLoadingSegments: true });

    try {
      const fetchSegmentsResult = await customerAnalyticsActions.fetchSegments(
        limit,
        offset
      );
      const segments = [{ key: null, label: "All Segments", id: null }];
      fetchSegmentsResult.data.Data.forEach(segment => {
        segments.push({ key: segment.id, label: segment.name, id: segment.id });
      });

      this.setState({ segments, selectedSegment: segments[0] });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isLoadingSegments: false });
    }
  }

  render() {
    const {
      windowDimensions,
      style,
      tabs,
      selectedTab,
      onTabSelected,
      customActions,
      actionBarStyle,
    } = this.props;
    const {
      scrollLeft,
      selectedLocation,
      selectedCounty,
      selectedSegment,
      selectedDateRange,
      segments,
      locations,
      counties,
      isLoadingSegments,
      isLoadingFilters,
      showSidePanel,
      sidePanel
    } = this.state;

    return (
      <div
        ref={this.ActionBarRef}
        onScroll={this.onScroll}
        style={{
          height: "100%",
          width: "100%",
          overflow: "visible",
          dislay: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          ...style
        }}
      >
        <ActionBarWrapper className="hide-scrollbars" style={actionBarStyle}>
          {tabs ? (
            <TabMenu
              tabs={tabs}
              selectedTab={selectedTab}
              onTabSelected={onTabSelected}
            />
          ) : null}
          <div className="action-group">
            <ActionDropdownDialog
              title={this.formatTitle(selectedDateRange.label)}
              options={dateRanges}
              onChange={this.onChangeDateRange}
              scrollLeft={scrollLeft}
              parent={this.ActionBarRef}
              windowDimensions={windowDimensions}
              closeOnSelect
              dialogComponent={<DateRangePicker range={selectedDateRange} />}
            />
          </div>
          {isLoadingSegments ? (
            <div
              style={{
                width: 100,
                padding: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
            </div>
          ) : (
            <div className="action-group">
              <ActionDropdownDialog
                title={this.formatTitle(selectedSegment.label)}
                options={segments}
                onChange={this.onChangeSegment}
                scrollLeft={scrollLeft}
                parent={this.ActionBarRef}
                windowDimensions={windowDimensions}
                closeOnSelect
              />
            </div>
          )}
          {/* {isLoadingFilters ? (
            <div
              style={{
                width: 100,
                padding: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
            </div>
          ) : (
            <div className="action-group">
              <ActionDropdownDialog
                title={this.formatTitle(selectedLocation.label)}
                options={locations}
                onChange={this.onChangeLocation}
                scrollLeft={scrollLeft}
                parent={this.ActionBarRef}
                windowDimensions={windowDimensions}
                closeOnSelect
              />
            </div>
          )} */}
          {/* {isLoadingFilters ? (
            <div
              style={{
                width: 100,
                padding: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
            </div>
          ) : (
            <div className="action-group">
              <ActionDropdownDialog
                title={this.formatTitle(selectedCounty.label)}
                options={counties}
                onChange={this.onChangeCounty}
                scrollLeft={scrollLeft}
                parent={this.ActionBarRef}
                windowDimensions={windowDimensions}
                closeOnSelect
              />
            </div>
          )} */}
          {customActions && customActions.length
            ? customActions.map(action => (
                <div className="action-group" key={action.name}>
                  <ActionDropdownDialog
                    title={this.formatTitle(action.selected.label)}
                    options={action.options}
                    onChange={action.callback}
                    scrollLeft={scrollLeft}
                    parent={this.ActionBarRef}
                    windowDimensions={windowDimensions}
                    closeOnSelect
                  />
                </div>
              ))
            : null}
          {isLoadingFilters ? (
            <div
              style={{
                width: 100,
                padding: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
            </div>
          ) : (
            <div className="action-group">
              <IconButton
                icon="filter_list"
                onClick={this.onViewFilters}
                style={{ marginBottom: 10 }}
              />
            </div>
          )}
          {showSidePanel ? <SidePanel component={sidePanel} /> : null}
        </ActionBarWrapper>
      </div>
    );
  }
}

export default ActionBar;
