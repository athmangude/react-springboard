/* eslint-disable object-curly-newline */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-access-state-in-setstate */

import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

@connect(() => ({}),
  (dispatch) => ({
    alertActions: bindActionCreators({ addAlert }, dispatch),
    dispatch,
  }))


class EditBusinessNumber extends Component {
  constructor(props) {
    super(props);
    const {
      id,
      location,
      business_identifier,
    } = this.props.businessNumber;

    this.state = {
      id,
      storeNumber: business_identifier,
      storeLocation: location,
      tillNumber: null,
      formData: {
        isFormValid: false,
        isEditing: false,
        isTogglingStatus: false,
        limit: 20,
        offset: 0,
        surveyId: this.props.surveyId,
      },
    };

    this.onChange = this.onChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.toggleBusinessNumber = this.toggleBusinessNumber.bind(this);
    this.stringifyFormData = this.stringifyFormData.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
  }

  onOpen() {
    this.setState({
      formData: { ...this.state.formData, openModal: true },
    });
  }

  onClose() {
    this.setState({
      formData: { ...this.state.formData, openModal: false },
    });
  }

  onFormValid() {
    this.setState({ formData: { ...this.state.formData, isFormValid: true } });
  }

  onFormInvalid() {
    this.setState({ formData: { ...this.state.formData, isFormValid: false } });
  }

  onChange = (event) => {
    const businessNumber = Object.assign({[event.target.name]: event.target.value });
    this.setState({
      ...businessNumber,
    }, () => { });
  };

  async onUpdate(event) {
    const { formData } = this.state;
    const { onCloseSidePanel, businessNumberActions, alertActions } = this.props;
    const form = event.target;
    const data = new FormData(form);

    this.setState({
      formData: { ...this.state.formData, isEditing: true }
    });

    for (const name of data.keys()) {
      const input = form.elements[name];
      const parserName = input.dataset.parse;
      if (parserName) {
        const parsedValue = inputParsers[parserName](data.get(name));
        data.set(name, parsedValue);
      }
    }

    this.setState({
      ...this.stringifyFormData(data),
    });

    try {
      await businessNumberActions.updateBusinessNumber(this.state);
      alertActions.addAlert({ type: 'success', message: 'Updated Successfully' });
      const fetchBusinessNumbersResult = await businessNumberActions.fetchBusinessNumbers(formData.surveyId, formData.limit, formData.offset);
      businessNumberActions.setBusinessNumbers(fetchBusinessNumbersResult.data.data.Data.items, fetchBusinessNumbersResult.data.data.Data.totalCount, 1);
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ formData: { ...this.state.formData, isEditing: false } });
      onCloseSidePanel();
    }
  }

  async toggleBusinessNumber() {
    const { formData } = this.state;
    const {
      businessNumber,
      onCloseSidePanel,
      businessNumberActions,
      alertActions,
    } = this.props;

    try {
      this.setState({
        formData: { ...this.state.formData, isTogglingStatus: true },
      });
      await businessNumberActions.toggleBusinessNumber(formData.surveyId, businessNumber.id, !businessNumber.status );
      alertActions.addAlert({ type: 'success', message: 'Updated Successfully' });
      const fetchBusinessNumbersResult = await businessNumberActions.fetchBusinessNumbers(formData.surveyId, formData.limit, formData.offset);
      businessNumberActions.setBusinessNumbers(fetchBusinessNumbersResult.data.data.Data.items, fetchBusinessNumbersResult.data.data.Data.totalCount, 1);
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({
        formData: { ...this.state.formData, isTogglingStatus: false },
      });
      onCloseSidePanel();
    }
  }

  stringifyFormData(fd) {
    const data = {};
    for (const key of fd.keys()) {
      data[key] = fd.get(key);
    }
    return data;
  }

  render() {
    const { businessNumber, onCloseSidePanel } = this.props;
    const { storeNumber, storeLocation, formData } = this.state;
    const colorMix = stringToHexColor(businessNumber.location);

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Edit Business Number</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(businessNumber.location)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>
                {businessNumber.location}
              </span>
            </div>
          </div>
          <Formsy
            noValidate
            onValid={this.onFormValid}
            onInvalid={this.onFormInvalid}
            onValidSubmit={this.onUpdate}
          >
            <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', position: 'relative' }}>
                <p style={{ padding: '0px 0px', margin: '0px 0px' }}>Business Number</p>
                <Input
                  name="storeNumber"
                  defaultValue={storeNumber}
                  onChange={this.onChange}
                  style={{ width: '100%', border: 'none', margin: '5px 0 10px', position: 'relative' }}
                  placeholder="Business Number..."
                  className="input"
                  required
                  validations={{ isExisty: true }}
                  validationErrors={{ isExisty: 'This field is required' }}
                  errorLabel={(
                    <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                  )}
                />
              </div>
            </div>

            <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', position: 'relative' }}>
                <p style={{ padding: '0px 0px', margin: '0px 0px' }}>Location</p>
                <Input
                  name="storeLocation"
                  defaultValue={storeLocation}
                  onChange={this.onChange}
                  style={{ width: '100%', border: 'none', margin: '5px 0 10px', position: 'relative' }}
                  placeholder="Location..."
                  required
                  validations={{ isExisty: true }}
                  validationErrors={{ isExisty: 'This field is required' }}
                  errorLabel={(
                    <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                  )}
                />
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
              <ActionButton className="primary" type="submit" large icon="edit" text="Update" disabled={!formData.isFormValid} loading={formData.isEditing} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </Formsy>
        </div>


        <div style={{ padding: '0 10px 0 10px', position: 'absolute', bottom: 80, width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large text={businessNumber.status ? 'Deactivate' : 'Activate'} disabled={formData.isTogglingStatus} loading={formData.isTogglingStatus} onClick={this.toggleBusinessNumber} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}

EditBusinessNumber.propTypes = {
  businessNumber: PropTypes.object,
  onCloseSidePanel: PropTypes.func,
};

export default EditBusinessNumber;
