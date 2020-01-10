import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";
import PropTypes from "prop-types";
import Spinner from "react-spinner-material";

import homeFeedActionBarStyles from "./homeActionBarStyles";

import ActionDropdown from "./action-dropdown";
import ActionDropdownDialog from "./action-dropdown-dialog";
import DateRangePicker from "./date-range-picker";

import themes from "SharedComponents/themes";

const { primaryColor } = themes.light;

import Tabs from "SharedComponents/tabs";

const HomeFeedActionBarWrapper = styled.div`
  ${homeFeedActionBarStyles}
`;

class HomeFeedActionBar extends Component {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);

    this.homeFeedActionBarRef = React.createRef();
  }

  state = {
    scrollLeft: 0
  };

  componentDidMount() {
    this.homeFeedActionBarRef.current.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    this.homeFeedActionBarRef.current.removeEventListener(
      "scroll",
      this.onScroll
    );
  }

  onScroll(event) {
    this.setState({ scrollLeft: event.target.scrollLeft });
  }

  render() {
    const {
      onFeedFiltersChanged,
      feedFilters,
      isLoadingFeed,
      isLoadingSocialFeed,
      windowDimensions,
      onActiveTabChanged,
      activeTab,
      configurations
    } = this.props;

    const { socialMedia } = configurations.features;

    const { scrollLeft } = this.state;

    return (
      <div
        ref={this.homeFeedActionBarRef}
        onScroll={this.onScroll}
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
          zIndex: 2,
          dislay: "flex",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <HomeFeedActionBarWrapper className="hide-scrollbars">
          <div className="action-group">
            {activeTab.toLowerCase() === "nps" ? (
              <ActionDropdown
                title="NPS&nbsp;Segments"
                options={[
                  {
                    key: "detractors",
                    property: "detractors",
                    label: "Detractors",
                    value: feedFilters.detractors,
                    icon: "sentiment_very_dissatisfied",
                    color: "#fd9681"
                  },
                  {
                    key: "passives",
                    property: "passives",
                    label: "Passives",
                    value: feedFilters.passives,
                    icon: "sentiment_neutral",
                    color: "#fcda6e"
                  },
                  {
                    key: "promoters",
                    property: "promoters",
                    label: "Promoters",
                    value: feedFilters.promoters,
                    icon: "sentiment_satisfied",
                    color: "#80c582"
                  }
                ]}
                onChange={onFeedFiltersChanged}
                scrollLeft={scrollLeft}
                parent={this.homeFeedActionBarRef}
                windowDimensions={windowDimensions}
                clearFeed
              />
            ) : null}
            {activeTab.toLowerCase() === "nps" ? (
              <ActionDropdown
                title="View&nbsp;Options"
                options={[
                  {
                    key: "all",
                    property: "bookmarked",
                    label: "All",
                    value:
                      !feedFilters.bookmarked || feedFilters.bookmarked === null
                        ? true
                        : false,
                    nullIsTrue: true
                  },
                  {
                    key: "bookmarked",
                    property: "bookmarked",
                    label: !feedFilters.bookmarked
                      ? "Unbookmarked"
                      : "Bookmarked",
                    value: feedFilters.bookmarked
                  }
                ]}
                onChange={onFeedFiltersChanged}
                scrollLeft={scrollLeft}
                parent={this.homeFeedActionBarRef}
                windowDimensions={windowDimensions}
                clearFeed
              />
            ) : null}
            {activeTab.toLowerCase() === "nps" ? (
              <ActionDropdownDialog
                title={feedFilters.timeRangeLabel}
                options={[
                  {
                    key: "today",
                    property: "bookmarked",
                    label: "Today",
                    value: feedFilters.bookmarked === null,
                    nullIsTrue: true,
                    changes: {
                      from: moment()
                        .utc()
                        .startOf("day")
                        .format(),
                      to: moment()
                        .utc()
                        .endOf("day")
                        .format(),
                      timeRangeLabel: "Today"
                    }
                  },
                  {
                    key: "last7Days",
                    property: "bookmarked",
                    label: "Last\u00a07\u00a0days",
                    value: feedFilters.bookmarked === true,
                    changes: {
                      from: moment()
                        .utc()
                        .subtract(7, "days")
                        .startOf("day")
                        .format(),
                      to: moment()
                        .utc()
                        .endOf("day")
                        .format(),
                      timeRangeLabel: "Last\u00a07\u00a0days"
                    }
                  },
                  {
                    key: "last30Days",
                    property: "bookmarked",
                    label: "Last\u00a030\u00a0days",
                    value: feedFilters.bookmarked === true,
                    changes: {
                      from: moment()
                        .utc()
                        .subtract(30, "days")
                        .startOf("day")
                        .format(),
                      to: moment()
                        .utc()
                        .endOf("day")
                        .format(),
                      timeRangeLabel: "Last\u00a030\u00a0days"
                    }
                  },
                  {
                    key: "customRange",
                    property: "bookmarked",
                    label: "Custom Range",
                    value: feedFilters.bookmarked === true,
                    dialogTrigger: true,
                    changes: {
                      from: moment()
                        .utc()
                        .subtract(30, "days")
                        .startOf("day")
                        .format(),
                      to: moment()
                        .utc()
                        .endOf("day")
                        .format(),
                      timeRangeLabel: "Custom Range"
                    }
                  }
                ]}
                onChange={changes => onFeedFiltersChanged(changes, true)}
                scrollLeft={scrollLeft}
                parent={this.homeFeedActionBarRef}
                windowDimensions={windowDimensions}
                closeOnSelect
                clearFeed
                dialogComponent={
                  <DateRangePicker feedFilters={feedFilters} returnDateInUTC />
                }
              />
            ) : null}
            {
              // nps ? (
              //   Object.keys(nps.npsMetadataFilters).map((filter) => (
              //     <ActionDropdown
              //       title={filter.replace('_', '\u00a0')}
              //       options={nps.npsMetadataFilters[filter].map((option) => ({ key: option, label: option.replace(' ', '\u00a0'), value: option }))}
              //       onChange={this.onNPSFIltersChanged}
              //       key={filter}
              //       scrollLeft={scrollLeft}
              //       parent={this.homeFeedActionBarRef}
              //     />
              //   ))
              // ) : null
            }
          </div>
          {/*
            <div className="action-group nps-actions">
              <Action onChange={onFeedFiltersChanged} color="#fd9681" tab active={feedFilters.detractors} type="nps" category="detractors" icon="sentiment_very_dissatisfied" filter="detractors" value={feedFilters.detractors} />
              <Action onChange={onFeedFiltersChanged} color="#fcda6e" tab active={feedFilters.passives} type="nps" category="passives" icon="sentiment_neutral" filter="passives" value={feedFilters.passives} />
              <Action onChange={onFeedFiltersChanged} color="#80c582" tab active={feedFilters.promoters} type="nps" category="promoters" icon="sentiment_satisfied" filter="promoters" value={feedFilters.promoters} />
            </div>
            */}
          <div
            className="action-group filter-actions"
            style={{ margin: "0 10px" }}
          >
            {isLoadingFeed || isLoadingSocialFeed ? (
              <Spinner spinnerColor={primaryColor} size={20} spinnerWidth={2} />
            ) : null}
            {/*
            <MaterialTooltip title={feedFilters.bookmarked ? 'bookmarked' : 'unbookmarked'} aria-label={feedFilters.bookmarked ? 'bookmarked' : 'unbookmarked'}>
              <Action onChange={onFeedFiltersChanged} clearFeed active={feedFilters.bookmarked} type="filter" category="bookmarked" icon={feedFilters.bookmarked ? 'bookmark' : 'bookmark_border'} filter="bookmarked" value={feedFilters.bookmarked} />
            </MaterialTooltip>
            <MaterialTooltip title={feedFilters.read ? 'read' : 'unread'} aria-label={feedFilters.read ? 'read' : 'unread'}>
              <Action onChange={onFeedFiltersChanged} clearFeed active={feedFilters.read} type="filter" category="read" icon={feedFilters.read ? 'visibility' : 'visibility_off'} filter="read" value={feedFilters.read} />
            </MaterialTooltip>
            */}
            {/* <CalendarAction onChange={this.props.onFeedFiltersChanged} active={false} type="filter" category="date" icon="date_range" filter="date" value={{ from: this.props.feedFilters.from, to: this.props.feedFilters.to }} /> */}
            {socialMedia ? (
              <Tabs
                tabs={[{ label: "NPS" }, { label: "Social" }]}
                active={activeTab}
                onChange={onActiveTabChanged}
                hideContentView
                hideBottomBorder
                style={{ margin: "0 20px 0 10px" }}
              />
            ) : null}
          </div>
        </HomeFeedActionBarWrapper>
      </div>
    );
  }
}

HomeFeedActionBar.propTypes = {
  feedFilters: PropTypes.object.isRequired,
  onFeedFiltersChanged: PropTypes.func.isRequired,
  isLoadingFeed: PropTypes.bool.isRequired
};

export default HomeFeedActionBar;
