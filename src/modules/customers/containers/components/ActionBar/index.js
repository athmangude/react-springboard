/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";
import PropTypes from "prop-types";

import ActionBarStyles from "./styles";

import TabMenu from "SharedComponents/tab";
import ActionDropdownDialog from "SharedComponents/action-dropdown-dialog";
import DateRangePicker from "SharedComponents/date-range-picker";

const ActionBarWrapper = styled.div`
  ${ActionBarStyles}
`;

const locations = [
  { key: null, label: "Locations" },
  { key: "nairobi", label: "Nairobi" },
  { key: "kikuyu", label: "Kikuyu" },
  { key: "mombasa", label: "Mombasa" },
  { key: "kakamega", label: "Kakamega" },
  { key: "kisumu", label: "Kisumu" },
  { key: "eldoret", label: "Eldoret" },
  { key: "limuru", label: "Limuru" },
  { key: "kiambu", label: "Kiambu" },
  { key: "thika", label: "Thika" },
  { key: "juja", label: "Juja" },
  { key: "ngong", label: "Ngong" }
];

const segments = [
  { id: null, label: "Segments" },
  { id: 1, label: "Segment A" },
  { id: 2, label: "Segment B" },
  { id: 3, label: "Segment C" }
];

const dateRanges = [
  {
    key: 1,
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
    key: 2,
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
    key: 3,
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
    key: 4,
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
  { key: 5, label: "Custom Range", dialogTrigger: true, value: {} }
];

class ActionBar extends Component {
  static propTypes = {
    windowDimensions: PropTypes.object,
    actions: PropTypes.array,
    style: PropTypes.object,
    tabs: PropTypes.array,
    selectedTab: PropTypes.string,
    onTabSelected: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.ActionBarRef = React.createRef();
    this.onScroll = this.onScroll.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeSegment = this.onChangeSegment.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
  }

  state = {
    scrollLeft: 0,
    selectedLocation: locations[0],
    selectedSegment: segments[0],
    selectedDateRange: dateRanges[2].value
  };

  componentDidMount() {
    this.ActionBarRef.current.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    this.ActionBarRef.current.removeEventListener("scroll", this.onScroll);
  }

  onScroll(event) {
    this.setState({ scrollLeft: event.target.scrollLeft });
  }

  onChangeLocation(selectedLocation) {
    this.setState({ selectedLocation });
  }

  onChangeSegment(selectedSegment) {
    this.setState({ selectedSegment });
  }

  onChangeDateRange(selectedDateRange) {
    this.setState({
      selectedDateRange: selectedDateRange.value
        ? selectedDateRange.value
        : selectedDateRange
    });
  }

  getTitle(items, key) {
    if (items.length) {
      if (!Object.keys(key).length) {
        return <span>{items[0].label.replace(/\s/g, "\u00A0")}</span>;
      }

      return <span>{key.label.replace(/\s/g, "\u00A0")}</span>;
    }

    return null;
  }

  render() {
    const {
      windowDimensions,
      actions,
      style,
      tabs,
      selectedTab,
      onTabSelected,
      actionBarStyle
    } = this.props;

    const {
      scrollLeft,
      selectedLocation,
      selectedSegment,
      selectedDateRange
    } = this.state;

    return (
      <div
        ref={this.ActionBarRef}
        onScroll={this.onScroll}
        style={{
          height: "100%",
          width: "100%",
          overflow: "visible",
          zIndex: 2,
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
          {actions.map(action => (
            <div className="action-group">
              <ActionDropdownDialog
                title={this.getTitle(action.items, action.active)}
                options={action.items}
                onChange={action.callBack}
                scrollLeft={scrollLeft}
                parent={this.ActionBarRef}
                windowDimensions={windowDimensions}
                closeOnSelect
                dialogComponent={action.dialogComponent}
              />
            </div>
          ))}
          {/* <div className="action-group">
            <ActionDropdownDialog
              title={selectedSegment.label}
              options={segments}
              onChange={this.onChangeSegment}
              scrollLeft={scrollLeft}
              parent={this.ActionBarRef}
              windowDimensions={windowDimensions}
              closeOnSelect
            />
          </div>
          <div className="action-group">
            <ActionDropdownDialog
              title={selectedDateRange.label}
              options={dateRanges}
              onChange={this.onChangeDateRange}
              scrollLeft={scrollLeft}
              parent={this.ActionBarRef}
              windowDimensions={windowDimensions}
              closeOnSelect
              clearFeed
              dialogComponent={(<DateRangePicker range={selectedDateRange} />)}
            />
          </div> */}
        </ActionBarWrapper>
      </div>
    );
  }
}

export default ActionBar;
