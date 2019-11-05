import React, { Component } from "react";
import IconButton from "SharedComponents/icon-button";

import Tabs from "SharedComponents/tabs";

export default class TabbedActivityMetrics extends Component {
  constructor(props) {
    super(props);

    this.onTabChanged = this.onTabChanged.bind(this);
  }

  static propTypes = {};

  state = {
    activeTab: "activitylog"
  };

  onTabChanged(activeTab) {
    this.setState({ activeTab });
  }

  render() {
    return (
      <Tabs
        active={this.state.activeTab}
        onChange={this.onTabChanged}
        rightControl={
          <IconButton
            icon="chevron_right"
            style={{ margin: 0, color: "#000" }}
            onClick={this.props.onToggleRightDrawer}
          />
        }
        tabs={[
          {
            label: "ActivityLog",
            component: this.props.activityLog
          },
          {
            label: "Metrics",
            component: this.props.metrics
          }
        ]}
      />
    );
  }
}
