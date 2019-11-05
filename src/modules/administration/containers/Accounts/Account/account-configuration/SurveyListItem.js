import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';

export default class SurveyListItem extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    survey: PropTypes.object,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    isMouseOver: false,
  }

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  onEdit(survey) {
    const { onEdit } = this.props;
    onEdit(survey);
  }

  onDelete(survey) {
    const { onDelete } = this.props;
    onDelete(survey);
  }

  render() {
    const { survey } = this.props;
    const { isMouseOver } = this.state;
    const ussd = survey.surveyMetadata.find((metadata) => metadata.name === 'ussd') || {};
    return (
      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: this.state.isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <span>{survey.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <span>{`*466#${ussd.value}#`}</span>
        </div>
        {
          isMouseOver ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', padding: '0 10px' }}>
              <IconButton onClick={() => this.onEdit(survey)} icon="edit" style={{ margin: 0, padding: 6 }} />
              <IconButton onClick={() => this.onDelete(survey)} icon="delete" style={{ margin: 0, padding: 6 }} />
            </div>
          ) : null
        }
      </div>
    );
  }
}
