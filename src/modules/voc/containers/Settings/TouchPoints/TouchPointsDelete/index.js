/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as touchpointActions from '../flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';
import ActionButton from 'SharedComponents/action-button';

@connect(() => ({}),
(dispatch) => ({
  touchpointActions: bindActionCreators(touchpointActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))


class TouchPointsDelete extends Component {
  constructor(props) {
    super(props);    

    this.state = {
      touchpoint: {},
      openModal: false,
      isDeleting: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteTouchpoint = this.deleteTouchpoint.bind(this);
  }

  componentDidMount() {
    const touchpoint = this.props;
    this.setState({ touchpoint });
  }

  openModal() {
    this.setState({ openModal: true });
  }

  closeModal() {
    this.setState({ openModal: false });
  }

  async deleteTouchpoint() {
    this.setState({ isDeleting: true });
    const { touchpoint } = this.state.touchpoint;

    try {
      await this.props.touchpointActions.deleteTouchPoint(touchpoint);
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully Deleted Touchpoint' });
    } catch(exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {       
      const fetchTouchPointsResult = await this.props.touchpointActions.fetchTouchPoints(touchpoint.surveyId);
      this.props.touchpointActions.setTouchPoints(fetchTouchPointsResult.data.data.Data.items, fetchTouchPointsResult.data.data.Data.totalCount, 1);
      this.setState({ isDeleting: false });
      this.closeModal();
    }
  }


  render() {
    const { touchpoint } = this.props;
    const { openModal, isDeleting } = this.state;
    return (
      <Modal
        trigger={(
          <div onClick={this.openModal}>
            <button className="ui circular button action-button" role="button" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: 'rgb(109, 110, 113)', width: '35px', height: '35px', borderRadius: '17.5px', margin: '10px 5px 3px', padding: '5px', backgroundColor: 'transparent' }}>
              <i className="material-icons" style={{ fontSize: '15px', margin: '0px', padding: '0px' }}>delete</i>
            </button>
          </div>
        )}
        open={openModal}
        onClose={this.closeModal}
        style={{ marginTop: 170, position: 'relative', marginRight: 'auto', marginLeft: 'auto', borderRadius: 8 }}
      >
        <Modal.Content style={{ borderRadius: 16 }}>
            <Header>Delete{' '}{touchpoint.value}{' '}Touchpoint</Header>
            <Modal.Description>
              <p>Are you sure you want to delete the {touchpoint.value} touchpoint?</p>
            </Modal.Description>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button onClick={this.closeModal} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', height: 35, borderRadius: 17.5, margin: '0 5px', padding: '3px 20px', backgroundColor: '#fff' }}>
                Dismiss
              </Button>
              <ActionButton onClick={this.deleteTouchpoint} loading={isDeleting} text="Submit" />
            </div>
          </Modal.Content>

      </Modal>

    );
  }
}

TouchPointsDelete.propTypes = {
  touchpoint: PropTypes.object,
};

export default TouchPointsDelete;
