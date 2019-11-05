import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import withAdminAuthentication from 'Utils/withAdminAuthentication';
import SimpleLayout from 'Layouts/simple-layout';
import CircularButton from 'SharedComponents/circular-button';
import ActionButton from 'SharedComponents/action-button';

import * as appActions from 'Modules/voc/containers/App/flux/actions';

import AddIndustry from './AddIndustry';
import EditIndustry from './EditIndustry';
import Industry from './components/Industry';
import SidePanel from './components/IndustrySidePanel';

@connect((state) => ({
  app: state.app,
  route: state.route,
}),
(dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
}))
class IndustryThemes extends Component {
  constructor(props) {
    super(props);

    this.onAddIndustry = this.onAddIndustry.bind(this);
    this.onEditIndustry = this.onEditIndustry.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
  }

  state = {
    isSidePanelOpen: true,
    // sidePanelAction: null,
    sidePanelAction: 'addIndustry',
    sidePanelTitle: 'Add Industry',
    activeIndustry: null,
  }

  onAddIndustry() {
    this.setState({ sidePanelAction: 'addIndustry', sidePanelTitle: 'Add Industry', isSidePanelOpen: true });
  }

  onEditIndustry(industry) {
    this.setState({ sidePanelAction: 'editIndustry', sidePanelTitle: 'Edit Industry', isSidePanelOpen: true, activeIndustry: industry });
  }

  onCloseSidePanel() {
    this.setState({ isSidePanelOpen: false, sidePanelAction: null, sidePanelTitle: null, activeIndustry: null });
  }

  render() {
    return (
      <SimpleLayout
        className="industry-themes"
        action={(size) => {
          if (size === 'small') {
            return (
              <CircularButton className="primary cta" icon="add" small color="#002366" onClick={this.onAddIndustry} />
            );
          }

          return (
            <ActionButton className="primary" icon="add" text="Add Industry" onClick={this.onAddIndustry} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, height: 50, borderRadius: 25, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)' }} />
          );
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start', flexWrap: 'wrap', width: '100%', padding: 10 }}>
          <Industry />
          <Industry />
          <Industry />
          <Industry />
        </div>
        <SidePanel open={this.state.isSidePanelOpen} onCloseSidePanel={this.onCloseSidePanel} title={this.state.sidePanelTitle}>
          {
            this.state.sidePanelAction === 'addIndustry' ? (
              <AddIndustry />
            ) : this.state.sidePanelAction === 'editIndustry' ? (
              <EditIndustry industry={this.state.activeIndustry} />
            ) : null
          }
        </SidePanel>
      </SimpleLayout>
    );
  }
}

export default withAdminAuthentication(IndustryThemes);
