import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import { Label } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import IconButton from 'SharedComponents/icon-button';
import Input from 'SharedComponents/mwamba-input';
import ActionButton from 'SharedComponents/action-button';

import * as accountsActions from '../../../../flux/actions';

@connect((state) => ({
  adminAuthentication: state.adminAuthentication,
}), (dispatch) => ({
  accountsActions: bindActionCreators(accountsActions, dispatch),
  dispatch,
}))
export default class WiFiSettingsForm extends Component {

  static propTypes = {
    accountDetails: PropTypes.object.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    EventHandler: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onInputChanged = this.onInputChanged.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSaveWiFi = this.onSaveWiFi.bind(this);
    this.onFormValid = this.onFormValid.bind(this);
    this.onFormInvalid = this.onFormInvalid.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onDropLogo = this.onDropLogo.bind(this);
    this.onDropLogoRejected = this.onDropLogoRejected.bind(this);
    this.onDropBackground = this.onDropBackground.bind(this);
    this.onDropBackgroundRejected = this.onDropBackgroundRejected.bind(this);
    this.checkWifiConfig = this.checkWifiConfig.bind(this);
  }

  state = {
    form: {
      welcomeMsg: '',
      logo: [],
      background: [],
      uploadError: false,
    },
    isSaving: false,
    formValid: false,
  }

  componentDidMount() {
    const { accountDetails } = this.props;
    this.checkWifiConfig(accountDetails);
  }


  onInputChanged(event) {
    const { form } = this.state;
    this.setState({ form: { ...form, [event.target.name]: event.target.value } });
  }

  onFormValid() {
    this.setState({ formValid: true });
  }

  onFormInvalid() {
    this.setState({ formValid: false });
  }

  onChange(value) {
    const { form } = this.state;
    this.setState({ form: { ...form, welcomeMsg: value } });
  }

  onCancel() {}

  async onSaveWiFi() {
    this.setState({ isSaving: true });
    const { accountDetails, alertActions, onCloseSidePanel, EventHandler } = this.props;
    const { form } = this.state;

    try {
      await this.props.accountsActions.createWifiSettings(accountDetails.id, form.welcomeMsg, form.background, form.logo);
      alertActions.addAlert({ type: 'success', message: 'The WiFi was succesfully configured' });
      onCloseSidePanel();
    } catch (exception) {
      EventHandler.handleException(exception);
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isSaving: false });
    }
  }

  onInvalidSubmit() {
    this.setState({ formValid: false });
  }

  onDropLogo(file) {
    const { form } = this.state;
    this.setState({ form: { ...form, logo: file, uploadError: false } }, () => {
    });
  }

  onDropLogoRejected = () => {
    const { form } = this.state;
    const { alertActions } = this.props;
    this.setState({ form: { ...form, uploadError: true, logo: [] } }, () => {
      alertActions.addAlert({ type: 'error', message: 'Maximum file upload size is 5MB' });
    });
  }

  onDropBackground(file) {
    const { form } = this.state;
    this.setState({ form: { ...form, background: file, uploadError: false } }, () => {

    });
  }

  onDropBackgroundRejected = () => {
    const { form } = this.state;
    const { alertActions } = this.props;
    this.setState({ form: { ...form, uploadError: true, background: [] } }, () => {
      alertActions.addAlert({ type: 'error', message: 'Maximum file upload size is 20MB' });
    });
  }

  checkWifiConfig(accountDetails) {
    const { form } = this.state;
    if (accountDetails.accountFeatures.wifi && accountDetails.accountFeatures.wifiCustomText !== null) {
      this.setState({ form: { ...form, welcomeMsg: accountDetails.accountFeatures.wifiCustomText } });
    }
  }


  render() {
    let previewLogo = null;
    let previewBackground = null;
    const { form, formValid, isSaving } = this.state;
    const { onCloseSidePanel, accountDetails } = this.props;

    if (accountDetails.accountFeatures.wifi === true && accountDetails.logo !== null) {
      previewLogo = <img alt="logo" src={accountDetails.logo} style={{ maxWidth: '100%', height: 'auto' }} />;
    }

    if (form.logo.length > 0 && form.uploadError === false) {
      previewLogo = <img alt="logo" src={form.logo[0].preview} style={{ maxWidth: '100%', height: 'auto' }} />;
    }

    if (accountDetails.accountFeatures.wifi === true && accountDetails.accountFeatures.wifiBackroundImageUrl !== null) {
      previewBackground = <img alt="background" src={accountDetails.accountFeatures.wifiBackroundImageUrl} style={{ maxWidth: '100%', height: 'auto' }} />;
    }

    if (form.background.length > 0 && form.uploadError === false && accountDetails.accountFeatures.wifiBackroundImageUrl === null) {
      previewBackground = <img alt="background" src={form.background[0].preview} style={{ maxWidth: '100%', height: 'auto' }} />;
    }

    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Customize Wifi</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: 10, height: 'calc(100% - 63px)', overflowY: 'auto', marginBottom: '80px' }}>
          <Formsy ref={(form) => this.form = form} action="#" onValid={this.onFormValid} onInvalid={this.onFormInvalid} onValidSubmit={this.onSaveWiFi} onInvalidSubmit={this.onInvalidSubmit}>
            <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', margin: '20px 3px' }}>
              <Input
                name="welcomeMsg"
                type="text"
                value={form.welcomeMsg}
                onChange={this.onInputChanged}
                placeholder="Welcome Message"
                required
                validations={{ isExisty: true }}
                validationErrors={{ isExisty: 'This field is required' }}
                style={{ width: '100%', padding: '10px 5px', margin: '10px 0 0', position: 'relative' }}
                className="input"
                errorLabel={(
                  <Label color="red" style={{ position: 'absolute', bottom: -16, left: 3, borderRadius: 0 }} />
                )}
              />
              <Dropzone
                onDrop={this.onDropLogo}
                multiple={false}
                onDropRejected={this.onDropLogoRejected}
                maxSize={5097152}
                style={{ border: 'dashed 2px #d9d9d9', padding: 20, width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100, margin: '10px 0px' }}
              >
                {
                  form.logo.length === 0 && accountDetails.logo === null ? (
                    <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>Drop your logo file here, or click to select it from your computer.</span>
                  ) : (
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'column' }}>
                      { previewLogo }
                      <div style={{ position: 'absolute', background: '#696969', height: '100%', width: '100%', opacity: '0.6', top: '0', left: '0', padding: '0', transition: 'opacity .5s'}}>
                        <p style={{ color: '#fff', lineHeight: '150px', fontFamily: 'arial', textAlign: 'center', fontSize: '1.6em' }}><strong>This is a logo preview</strong></p>
                      </div>
                    </div>
                  )
                }
              </Dropzone>
              <Dropzone
                onDrop={this.onDropBackground}
                multiple={false}
                onDropRejected={this.onDropBackgroundRejected}
                maxSize={20097152}
                style={{ border: 'dashed 2px #d9d9d9', padding: 20, width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}
              >
                {
                  form.background.length === 0 && accountDetails.accountFeatures.wifiBackroundImageUrl === null ? (
                    <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>Drop your background file here, or click to select it from your computer.</span>
                  ) : (
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'column' }}>
                      { previewBackground }
                      <div style={{ position: 'absolute', background: '#696969', height: '100%', width: '100%', opacity: '0.6', top: '0', left: '0', padding: '0', transition: 'opacity .5s'}}>
                        <p style={{ color: '#fff', lineHeight: '150px', fontFamily: 'arial', textAlign: 'center', fontSize: '1.6em' }}><strong>This is a backround preview</strong></p>
                      </div>
                    </div>
                  )
                }
              </Dropzone>
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActionButton type="submit" className="primary" text="Submit" disabled={!formValid || isSaving } loading={isSaving} large style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </Formsy>
        </div>
      </div>
    );
  }
}
