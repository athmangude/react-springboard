/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable object-curly-newline */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header } from 'semantic-ui-react';
import { Dropdown } from 'formsy-semantic-ui-react';
import Spinner from 'react-spinner-material';
import 'react-input-range/lib/css/index.css';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import MwambaDropDownSelectTwo from 'SharedComponents/mwamba-dropdown-select-two';
import MultiSelectTag from 'SharedComponents/multi-select-tags';

import './index.css';

export default class AudienceSegment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    isFetchingAudiences: PropTypes.bool.isRequired,
    audiences: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onFilterChanged: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { form } = this.props;

    this.addAudienceFilter = this.addAudienceFilter.bind(this);
    this.removeAudienceFilter = this.removeAudienceFilter.bind(this);
    this.onGenderChanged = this.onGenderChanged.bind(this);
    this.onUpperLimitChanged = this.onUpperLimitChanged.bind(this);
    this.onLowerLimitChanged = this.onLowerLimitChanged.bind(this);
    this.onMultiSelectChanged = this.onMultiSelectChanged.bind(this);
    this.onPanelChanged = this.onPanelChanged.bind(this);
    this.fetchAudienceMetadata = this.fetchAudienceMetadata.bind(this);
    this.changeToNameValuePair = this.changeToNameValuePair.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.state = {
      setPanelId: form.audience,
      fetchingAudienceFilters: false,
      audienceFilters: {},
      selectedAudienceFilters: {
        selectedAge: [],
        selectedCounty: [],
        selectedGender: null,
        selectedRegion: [],
        selectedLsm: [],
        selectedEmploymentType: [],
        selectedEducationLevel: [],
      },
    };
  }

  componentDidMount() {
    const { form } = this.props;

    if (form.audience) {
      this.fetchAudienceMetadata(form.audience, true);
    }
  }

  onGenderChanged(gender) {
    const { onFilterChanged } = this.props;

    const { selectedAudienceFilters } = this.state;

    this.setState({ selectedAudienceFilters: { ...selectedAudienceFilters, selectedGender: gender } }, () => onFilterChanged(this.state.selectedAudienceFilters));
  }

  onLowerLimitChanged(event, index) {
    const { onFilterChanged } = this.props;

    const { selectedAudienceFilters } = this.state;

    const value = event.target.value;

    const { selectedAge } = selectedAudienceFilters;

    selectedAge[index] = [value, selectedAge[index][1]];

    this.setState({ selectedAudienceFilters: { ...selectedAudienceFilters, selectedAge } });

    onFilterChanged(this.state.selectedAudienceFilters);
  }

  onUpperLimitChanged(event, index) {
    const { onFilterChanged } = this.props;

    const { selectedAudienceFilters } = this.state;

    const value = event.target.value;

    const { selectedAge } = selectedAudienceFilters;

    selectedAge[index] = [selectedAge[index][0], value];

    this.setState({ selectedAudienceFilters: { ...selectedAudienceFilters, selectedAge } });

    onFilterChanged(this.state.selectedAudienceFilters);
  }

  onMultiSelectChanged(type, value) {
    const { onFilterChanged } = this.props;
    const { selectedAudienceFilters } = this.state;

    selectedAudienceFilters[type] = value;

    this.setState({ selectedAudienceFilters }, () => onFilterChanged(selectedAudienceFilters));
  }

  onPanelChanged(event, { name, value }) {
    const { onChange } = this.props;

    this.fetchAudienceMetadata(value);

    onChange(event, { name, value });
  }

  addAudienceFilter(type, value) {
    const { onFilterChanged } = this.props;

    const { selectedAudienceFilters } = this.state;

    selectedAudienceFilters[type].push(value);

    this.setState({ selectedAudienceFilters }, () => onFilterChanged(selectedAudienceFilters));
  }

  removeAudienceFilter(type, indexToBeRemoved) {
    const { onFilterChanged } = this.props;

    const { selectedAudienceFilters } = this.state;

    const currentArray = selectedAudienceFilters[type];

    const newArray = currentArray.filter((value, index) => index !== indexToBeRemoved);

    this.setState({ selectedAudienceFilters: { ...selectedAudienceFilters, [type]: newArray } }, () => onFilterChanged(this.state.selectedAudienceFilters));
  }

  resetFilters() {
    const { onFilterChanged } = this.props;

    this.setState({
      selectedAudienceFilters: {
        selectedAge: [],
        selectedCounty: [],
        selectedGender: null,
        selectedRegion: [],
        selectedLsm: [],
        selectedEmploymentType: [],
        selectedEducationLevel: [],
      },
    }, () => onFilterChanged(this.state.selectedAudienceFilters));
  }

  changeToNameValuePair(values) {
    const nameValuePair = [];

    values
      .filter((value) => value !== null)
      .map((value) => (
        nameValuePair.push({ label: value, value })
      ));

    return nameValuePair;
  }

  checkSetFilters(audienceFilters) {
    const { form } = this.props;

    const { selectedAudienceFilters } = this.state;

    Object.keys(audienceFilters).map((audienceFilter) => {
      const foundAudienceFilter = form.surveyMetadata.find((metadata) => metadata.name === audienceFilter);
      if (foundAudienceFilter) {
        if (foundAudienceFilter.name === 'gender') {
          this.onGenderChanged(foundAudienceFilter.value);
        } else if (foundAudienceFilter.name === 'age') {
          const selectedAge = JSON.parse(foundAudienceFilter.value).map((value) => value.split('-'));
          this.setState({ selectedAudienceFilters: { ...selectedAudienceFilters, selectedAge } });
        } else {
          this.onMultiSelectChanged(`${`selected${audienceFilter.charAt(0).toUpperCase()}${audienceFilter.slice(1)}`}`, JSON.parse(foundAudienceFilter.value));
        }
      }
    });
  }

  async fetchAudienceMetadata(panelId, initialLoad) {
    const { audiencesActions, form } = this.props;
    const { setPanelId } = this.state;

    if (!initialLoad) this.resetFilters();

    this.setState({ fetchingAudienceFilters: true });

    try {
      const audienceMetadataResult = await audiencesActions.getAudienceMetadata(panelId);

      const audienceFilters = {};

      if (audienceMetadataResult.data.data.Data.age) audienceFilters.age = audienceMetadataResult.data.data.Data.age;
      if (audienceMetadataResult.data.data.Data.gender) audienceFilters.gender = audienceMetadataResult.data.data.Data.gender;
      if (audienceMetadataResult.data.data.Data.county) audienceFilters.county = audienceMetadataResult.data.data.Data.county;
      if (audienceMetadataResult.data.data.Data.lsm) audienceFilters.lsm = audienceMetadataResult.data.data.Data.lsm;
      if (audienceMetadataResult.data.data.Data.employment_type) audienceFilters.employmentType = audienceMetadataResult.data.data.Data.employment_type;
      if (audienceMetadataResult.data.data.Data.education_level) audienceFilters.educationLevel = audienceMetadataResult.data.data.Data.education_level;
      if (audienceMetadataResult.data.data.Data.education_level) audienceFilters.region = audienceMetadataResult.data.data.Data.region;

      this.setState({ audienceFilters });

      if (form !== null && form.surveyMetadata && setPanelId === panelId) {
        this.checkSetFilters(audienceFilters);
      }
    } catch (exception) {
      // ActivityHandler.handleException(this.props.dispatch, exception);
    // eslint-disable-next-line no-empty
    } finally {
      this.setState({ fetchingAudienceFilters: false });
    }
  }

  render() {
    const { form, audiences, onChange, isFetchingAudiences } = this.props;
    const { fetchingAudienceFilters, audienceFilters, selectedAudienceFilters } = this.state;
    const selectedAudience = (audiences) ? audiences.find((audience) => audience.value === form.audience) : null;
    const { county, region, educationLevel, employmentType, age, gender, lsm } = audienceFilters;
    const { selectedAge: selectedAges, selectedCounty, selectedRegion, selectedLsm, selectedEducationLevel, selectedEmploymentType, selectedGender } = selectedAudienceFilters;
    
    return (
      <div className="audience-segment" style={{ width: '100%', display: 'flex', flexDirection: 'column', margin: '10px 0 30px', border: 'solid 2px #d9d9d9' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center', justifyContent: 'center', margin: '0px 0 0', flexWrap: 'wrap', marginBottom: 0 }}>
          <div className="audience-dropdown" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            {
              form.objective.toLowerCase() === 'cs' ? (
                <Dropdown
                  name="audience"
                  validations={{ }}
                  validationErrors={{ minLength: 'audience is Required', isExisty: 'audience is required' }}
                  onChange={onChange}
                  value={form.audience}
                  options={audiences}
                  loading={isFetchingAudiences}
                  search
                  placeholder="Select Audience (Optional)"
                  selection
                  style={{ height: 50, borderRadius: 0, margin: '0 !important', width: '100%', borderBottom: '2px solid #d9d9d9', borderLeft: 'none', borderRight: 'none' }}
                  icon={isFetchingAudiences ? (
                    <div style={{ float: 'right', position: 'absolute', top: 18, right: 7, color: '#808285' }}>
                      <Spinner spinnerColor="#808285" size={15} spinnerWidth={2} />
                    </div>
                  ) : (
                    <i style={{ float: 'right', position: 'absolute', top: -5, right: 7, color: '#808285' }} className="material-icons">keyboard_arrow_down</i>
                  )}
                />
              ) : (
                <Dropdown
                  name="audience"
                  validations={{ isExisty: true }}
                  validationErrors={{ minLength: 'audience is Required', isExisty: 'audience is required' }}
                  onChange={this.onPanelChanged}
                  value={form.audience}
                  options={audiences}
                  loading={isFetchingAudiences}
                  search
                  placeholder="Select Audience"
                  selection
                  style={{ height: 50, borderRadius: 0, margin: '0 !important', width: '100%', borderBottom: (selectedAudience) ? '2px solid #d9d9d9' : 'none', borderLeft: 'none', borderRight: 'none' }}
                  icon={isFetchingAudiences ? (
                    <div style={{ float: 'right', position: 'absolute', top: 18, right: 7, color: '#808285' }}>
                      <Spinner spinnerColor="#808285" size={15} spinnerWidth={2} />
                    </div>
                  ) : (
                    <i style={{ float: 'right', position: 'absolute', top: -5, right: 7, color: '#808285' }} className="material-icons">keyboard_arrow_down</i>
                  )}
                />
              )
            }
          </div>
        </div>
        {
          (fetchingAudienceFilters) ? (
            <ReactPlaceholder
              showLoadingAnimation
              customPlaceholder={(
                <div style={{ margin: '10px 0px 10px 0px' }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    <RectShape key={1} color="#d9d9d9" style={{ height: 40, width: 200, borderRadius: 40, margin: '3px 5px' }} />
                    <RectShape key={2} color="#d9d9d9" style={{ height: 40, width: 200, borderRadius: 40, margin: '3px 5px' }} />
                  </div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    <RectShape key={3} color="#d9d9d9" style={{ height: 40, width: 200, borderRadius: 40, margin: '3px 5px' }} />
                    <RectShape key={4} color="#d9d9d9" style={{ height: 40, width: 200, borderRadius: 40, margin: '3px 5px' }} />
                  </div>
                </div>
              )}
            />
          ) : null
        }
        {
          (selectedAudience && !fetchingAudienceFilters && Object.keys(audienceFilters).length) ? (
            <div style={{ width: '100%', backgroundColor: '#fff', padding: '15px' }}>
              <Header as="h5" content="Filter audiences" dividing />

              <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}>

                {
                  (gender && gender.length) ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', flexFlow: 'row wrap', width: '100%', marginTop: '10px' }}>
                      <p><strong>Gender: </strong></p>
                      <MwambaDropDownSelectTwo value={selectedGender} options={gender} placeholder="Select gender" onChange={this.onGenderChanged} textTransform="capitalize" />
                    </div>
                  ) : null
                }

                {
                  (age) ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', flexFlow: 'row wrap', width: '100%', marginTop: '10px' }}>
                      <p><strong>Age: </strong></p>
                      {
                        selectedAges.map((selectedAge, index) => (
                          <div style={{ position: 'relative', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgb(217, 217, 217)', padding: '3px 10px', margin: '3px 5px', borderRadius: '40px' }}>
                              <i onClick={(e) => this.removeAudienceFilter('selectedAge', index)} className="material-icons" style={{ color: '#d9d9d9', margin: 'auto 10px auto 0' }}>close</i>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <b onClick={this.onToggleMenu} style={{ color: '#6d6e71' }}>BETWEEN</b>
                                <input onChange={(e) => this.onLowerLimitChanged(e, index)} value={parseInt(selectedAge[0])} type="number" name="fromValue" min={parseInt(age[0])} max={parseInt(age[1])} style={{ border: 'none', width: 60, height: 40, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                                <b onClick={this.onToggleMenu} style={{ color: '#6d6e71' }}>AND</b>
                                <input onChange={(e) => this.onUpperLimitChanged(e, index)} value={parseInt(selectedAge[1])} type="number" name="toValue" min={parseInt(age[0])} max={parseInt(age[1])} style={{ border: 'none', width: 60, height: 40, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                              </div>
                            </div>
                          </div>
                        ))
                      }

                      <div onClick={() => this.addAudienceFilter('selectedAge', age)} className="add-validation-rule" style={{ border: 'dashed 1px #d9d9d9', padding: 10, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 185 }}>
                        <i className="material-icons" style={{ color: '#d9d9d9', margin: 'auto 10px auto 0' }}>add</i>
                        &nbsp;
                        <span style={{ color: '#d9d9d9' }}>Add age filter</span>
                      </div>
                    </div>
                  ) : null
                }

                {/* {
                  (county && county.length) ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', width: '100%', marginTop: 10 }}>
                      <p><strong>County: </strong></p>
                      <MultiSelectTag buttonStyle={{ borderRadius: 20 }} options={county} selectedOptions={selectedCounty} type="selectedCounty" onChange={this.onMultiSelectChanged} removeFilter={this.removeAudienceFilter} textTransform="capitalize" placeholder="Add county" inverse />
                    </div>
                  ) : null
                } */}

                {
                  (region && region.length) ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', width: '100%', marginTop: 10 }}>
                      <p><strong>Region: </strong></p>
                      <MultiSelectTag buttonStyle={{ borderRadius: 20 }} options={region} selectedOptions={selectedRegion} type="selectedRegion" onChange={this.onMultiSelectChanged} removeFilter={this.removeAudienceFilter} textTransform="capitalize" placeholder="Add region" inverse />
                    </div>
                  ) : null
                }

                {/* {
                  (lsm && lsm.length) ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', width: '100%', marginTop: 10 }}>
                      <p><strong>LSM: </strong></p>
                      <MultiSelectTag buttonStyle={{ borderRadius: 20 }} options={lsm} selectedOptions={selectedLsm} type="selectedLsm" onChange={this.onMultiSelectChanged} removeFilter={this.removeAudienceFilter} textTransform="capitalize" placeholder="Add LSM" inverse />
                    </div>
                  ) : null
                } */}

                {/* {
                  (educationLevel && educationLevel.length) ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', width: '100%', marginTop: 10 }}>
                      <p><strong>Education Level: </strong></p>
                      <MultiSelectTag buttonStyle={{ borderRadius: 20 }} options={educationLevel} selectedOptions={selectedEducationLevel} type="selectedEducationLevel" onChange={this.onMultiSelectChanged} removeFilter={this.removeAudienceFilter} textTransform="capitalize" placeholder="Add education level" inverse />
                    </div>
                  ) : null
                } */}

                {/* {
                  (employmentType && employmentType.length) ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', width: '100%', marginTop: 10 }}>
                      <p><strong>Employment Type: </strong></p>
                      <MultiSelectTag buttonStyle={{ borderRadius: 20 }} options={employmentType} selectedOptions={selectedEmploymentType} type="selectedEmploymentType" onChange={this.onMultiSelectChanged} removeFilter={this.removeAudienceFilter} textTransform="capitalize" placeholder="Add employement type" inverse />
                    </div>
                  ) : null
                } */}

              </div>
            </div>
          ) : null
        }

        {
          (selectedAudience && !fetchingAudienceFilters && !Object.keys(audienceFilters).length) ? (
            <div style={{ width: '100%', backgroundColor: '#fff', padding: '15px', display: 'flex', justifyContent: 'center' }}>
              <p>No filters available that can be applied to this audience</p>
            </div>
          ) : null
        }

        {
          (selectedAudience && !fetchingAudienceFilters) ? (
            <Button onClick={(event) => onChange(event, { name: 'audience', value: null })} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 0 }}>
              <i style={{ float: 'right', color: '#808285' }} className="material-icons">close</i>
              <span>Clear Audience Selection</span>
            </Button>
          ) : null
        }
      </div>
    );
  }
}
