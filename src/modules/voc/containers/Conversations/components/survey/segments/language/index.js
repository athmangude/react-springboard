/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'formsy-semantic-ui-react';
import Spinner from 'react-spinner-material';

import './index.css';

export default class LanguageSegment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    languagesActions: PropTypes.func.isRequired,
    EventHandler: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.state = {
      language: 'en-US',
      languages: [],
      isFetchingLanguages: false,
    };
  }

  componentDidMount() {
    this.fetchLanguages();
  }

  componentWillReceiveProps(newProps) {
    const { form } = this.props;
    const { language } = newProps.form;
    if (language !== form.language) {
      this.setState({ language });
    }
  }

  onChange(event, { name, value }) {
    const { onChange } = this.props;
    onChange(event, { name, value });
  }

  async fetchLanguages() {
    const { languagesActions, EventHandler } = this.props;
    this.setState({ isFetchingLanguages: true });
    try {
      const fetchLanguagesResults = await languagesActions.fetchLanguages();
      const languages = fetchLanguagesResults.data.data.Data.items.map((language) => ({ key: language.id, value: language.iso_code, text: language.name }));
      this.setState({ languages });
    } catch (exception) {
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingLanguages: false });
    }
  }

  render() {
    const { language, languages, isFetchingLanguages } = this.state;
    return (
      <div className="language-segment" style={{ width: '100%', display: 'flex', flexDirection: 'column', margin: '10px 0 30px', border: 'solid 2px #d9d9d9' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center', justifyContent: 'center', margin: '0px 0 0', flexWrap: 'wrap', marginBottom: 0 }}>
          <div className="language-dropdown" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <Dropdown
              name="language"
              validations={{ isExisty: true }}
              validationErrors={{ minLength: 'language is Required', isExisty: 'language is required' }}
              onChange={this.onChange}
              value={language}
              options={languages}
              loading={isFetchingLanguages}
              search
              placeholder="Select Language"
              selection
              style={{ height: 50, borderRadius: 0, margin: '0 !important', width: '100%', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }}
              icon={isFetchingLanguages ? (
                <div style={{ float: 'right', position: 'absolute', top: 18, right: 7, color: '#808285' }}>
                  <Spinner spinnerColor="#808285" size={15} spinnerWidth={2} />
                </div>
              ) : (
                <i style={{ float: 'right', position: 'absolute', top: 10, right: 7, color: '#808285' }} className="material-icons">keyboard_arrow_down</i>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}
