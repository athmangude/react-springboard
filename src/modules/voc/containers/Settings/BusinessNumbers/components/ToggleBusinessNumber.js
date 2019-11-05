import React, { Component } from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import IconButton from 'SharedComponents/icon-button';

import ActionButton from 'SharedComponents/action-button';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

@connect(() => ({}), 
(dispatch) => ({
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))


class ToggleBusinessNumber extends Component {

  constructor(props) {
    super(props);

    this.state = {
      surveyId: this.props.surveyId,
      businessNumber: this.props.businessNumber,
      isModalOpen: false,
      isUpdating: false,
      limit: 20,
      offset: 0,
      status: this.props.businessNumber.status,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleBusinessNumber = this.toggleBusinessNumber.bind(this);
  }


  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });

  }

  async toggleBusinessNumber() {
    const { surveyId, limit, offset, businessNumber, status } = this.state;
    try {
      this.setState({ isUpdating: true });
      await this.props.businessNumberActions.toggleBusinessNumber(surveyId, businessNumber.id, !status );
      this.props.alertActions.addAlert({ type: 'success', message: 'Updated Successfully' });
      const fetchBusinessNumbersResult = await this.props.businessNumberActions.fetchBusinessNumbers(surveyId, limit, offset);
      this.props.businessNumberActions.setBusinessNumbers(fetchBusinessNumbersResult.data.data.Data.items, fetchBusinessNumbersResult.data.data.Data.totalCount, 1);
   
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isUpdating: false }, () => this.closeModal());      
    }
    
  }

  render() {
    const { isModalOpen, isUpdating, status } = this.state;
    return (
      <div ref={(ref) => this.handleRef = ref}>
        <Modal dimmer="blurring" 
          trigger={<IconButton onClick={this.openModal} icon={status ? 'person_add_disabled' : 'person_add'} style={{ width: 35, alignSelf: 'flex-start', margin: 0, padding: 0 }} />} 
          style={{ borderRadius: 16, marginTop: 170, marginRight: 'auto', marginLeft: 'auto', position: 'relative' }}
          open={isModalOpen}
          onClose={this.closeModal}
        >
          <Modal.Content style={{ borderRadius: 16 }}>
            <Header>{status ? 'Disable' : 'Enable'} Business Number </Header>
            <Modal.Description>
              <p>Are you sure you want to {status ? 'disable' : 'enable'} business number?</p>
            </Modal.Description>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button onClick={this.closeModal} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', height: 35, borderRadius: 17.5, margin: '0 5px', padding: '3px 20px', backgroundColor: '#fff' }}>
                Dismiss
              </Button>
              <ActionButton onClick={this.toggleBusinessNumber} loading={isUpdating} text={status ? 'Disable' : 'Enable'} />
            </div>
          </Modal.Content>
        </Modal>
      </div>
      
    );
  };
}

export default ToggleBusinessNumber;