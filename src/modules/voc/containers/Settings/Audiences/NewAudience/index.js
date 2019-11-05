import React, { Component } from 'react';
import { Row, Col } from 'react-grid-system';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Header, Form, Input, Dropdown, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import { RadioGroup, Radio } from 'react-radio-group';

import ActionButton from 'SharedComponents/action-button-styled';
import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../../components/SettingsNavigationContainer';

import * as audienceActions from '../flux/actions';

@connect((state) => ({
  authentication: state.authentication,
}),
(dispatch) => ({
  audienceActions: bindActionCreators(audienceActions, dispatch),
  dispatch,
}))
class NewAudience extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    EventHandler: PropTypes.object,
    authentication: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onViewAudience = this.onViewAudience.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPhoneNumerFieldChange = this.onPhoneNumerFieldChange.bind(this);
  }

  state = {
    file: null,
    data: null,
    newAudience: {
      name: '',
      country: null,
      incentive: 0,
      panel: null,
      phoneNumberField: null,
    },
  }

  onViewAudience() {
    this.context.router.history.push('/settings/audiences');
  }

  onDrop(files) {
    this.setState({ file: files[0] }, () => {
      Papa.parse(this.state.file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: false,
        complete: (data) => {
          this.setState({
            data,
            newAudience: { ...this.state.newAudience, panel: data.data },
          });
        },
      });
    });
  }

  onChange(event, { name, value }) {
    this.setState({
      newAudience: { ...this.state.newAudience, [name]: value },
    });
  }

  onPhoneNumerFieldChange(field) {
    this.setState({
      newAudience: { ...this.state.newAudience, phoneNumberField: field },
    });
  }

  async onSubmit() {
    this.setState({ submitting: true });

    const audience = {
      name: this.state.newAudience.name,
      country: this.state.newAudience.country,
      incentive: this.state.newAudience.incentive,
      phoneField: this.state.newAudience.phoneNumberField,
      type: 'PANEL',
      participantJson: this.state.data.data.map((participant) => {
        // const { [this.state.phoneNumberField], ...meta } = participant;
        const meta = JSON.parse(JSON.stringify(participant));
        delete meta[this.state.newAudience.phoneNumberField];
        return {
          commId: participant[this.state.newAudience.phoneNumberField],
          meta,
        };
      }),
    };

    try {
      await this.props.audienceActions.createAudience(audience);
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully added audience' });
      this.props.EventHandler.trackEvent({ category: 'Audiences', action: 'add audience', value: true });
      this.context.router.history.push('/settings/audiences');
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'Audiences', action: 'add audience', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ submitting: false });
    }
  }

  render() {
    return (
      <SettingsNavigationContainer
        topRightComponent={(
          <ActionButton icon="visibility" text="View Audience" onClick={this.onViewAudience} />
        )}
        EventHandler={this.props.EventHandler}
      >
        <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
              <h3>AUDIENCE DETAILS</h3>
              <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
                Enter the audience basic details
                <Header.Subheader style={{ textAlign: 'center' }}>
                  This information will be used to identify the audience.
                </Header.Subheader>
              </Header>

              <div style={{ width: '100%', margin: '10px 0' }}>
                <b>Audience name</b>
                <Input
                  label={false}
                  placeholder="Audience name"
                  name="name"
                  value={this.state.newAudience.name}
                  onChange={this.onChange}
                  className="full-width-input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ width: '100%', margin: '10px 0' }}>
                <b>Country</b>
                <Form.Field
                  control={Dropdown}
                  name="country"
                  value={this.state.newAudience.country}
                  onChange={this.onChange}
                  onSelect={this.onChange}
                  placeholder="Select Country"
                  selection
                  options={this.props.authentication.user.countries.map((country) => ({
                    key: country.id,
                    value: country.id,
                    flag: country.code.toLowerCase(),
                    text: country.name,
                  }))}
                  width={8}
                  style={{ width: '100%', borderRadius: 0 }}
                  className="custom-field"
                />
              </div>

              <div style={{ width: '100%', margin: '10px 0' }}>
                <b>Incentive</b>
                <Input
                  label={false}
                  placeholder="Incentive"
                  name="incentive"
                  value={this.state.newAudience.incentive}
                  onChange={this.onChange}
                  className="full-width-input-field"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
              <h3>AUDIENCE UPLOAD</h3>
              <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
                Upload your audience
                <Header.Subheader style={{ textAlign: 'center' }}>
                  Provide a valid audience csv file
                </Header.Subheader>
              </Header>
              <div style={{ width: '100%', padding: '0 20%' }}>
                <Dropzone
                  accept="text/csv"
                  onDrop={this.onDrop}
                  multiple={false}
                  style={{ border: 'dashed 2px #d9d9d9', padding: 20, width: '100%', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}
                >
                  {
                    !this.state.file ? (
                      <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>Drop your audience file here, or click to select it from your computer.</span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'column' }}>
                        <i className="material-icons" style={{ margin: '0px 15px' }}>insert_drive_file</i>
                        <span style={{ textAlign: 'center', fontSize: 15, color: 'rgba(0, 0, 0, 0.5)' }}>{this.state.file.name}</span>
                      </div>
                    )
                  }
                </Dropzone>
              </div>
              <div>
              </div>
            </div>
            {
              this.state.data ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                  <h3>PHONE NUMBER FIELD</h3>
                  <Header as="h5" style={{ marginTop: 20, textAlign: 'center' }}>
                    Specify Phone Number Field
                    <Header.Subheader style={{ textAlign: 'center' }}>
                      Specify the column in the sheet that contains the phone numbers
                    </Header.Subheader>
                  </Header>
                  <div style={{ width: '100%', padding: 0, border: 'solid 1px #d9d9d9' }}>
                    <RadioGroup
                      name="phoneNumberField"
                      style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'row' }}
                      selectedValue={this.state.newAudience.phoneNumberField}
                      onChange={this.onPhoneNumerFieldChange}
                    >
                      {this.state.data.meta.fields.map((field) => (
                        <Col style={{ border: 'solid 1px #d9d9d9', backgroundColor: '#fafafa', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                          <Radio value={field} style={{ marginRight: 10 }} />
                          <b>{field}</b>
                        </Col>
                      ))}
                    </RadioGroup>
                    {
                      this.state.data.data.map((row) => (
                        <Row style={{ margin: 0, padding: 0 }}>
                          {
                            Object.values(row).map((entry) => (
                              <Col style={{ border: 'solid 1px #d9d9d9', height: 30, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>{entry}</Col>
                            ))
                          }
                        </Row>
                      ))
                    }
                  </div>
                </div>
              ) : null
            }
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '20px 0', width: '100%' }}>
              <Button loading={this.state.submitting} disabled={!(this.state.newAudience.name.length && this.state.newAudience.country && this.state.newAudience.panel && this.state.newAudience.phoneNumberField) || this.state.submitting} onClick={this.onSubmit} style={{ height: 35, borderRadius: 17.5, backgroundColor: '#002366', marginRight: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -5 }}>
                  <i className="material-icons" style={{ color: '#FFF', marginRight: 10 }}>file_upload</i>
                  <span style={{ color: '#FFF', fontSize: 12 }}>Submit</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(NewAudience);
