import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';
import moment from 'moment';
import Case from 'case';
import DocumentTitle from 'react-document-title';

class SurveyTitle extends React.Component {
  render() {
    const { title, status, dateCreated, children } = this.props;
    const { sentence } = Case;
    return (
      <DocumentTitle title={`${sentence(title)} - Report | mSurvey`}>
        <div className="top">
          <div className="name-box">
            <span>
              <Label basic color="red">{sentence(status)}</Label> · <span style={{ fontSize: 'larger', fontWeight: 900 }}>{ sentence(title) }</span>
              <span style={{ fontSize: 'smaller', color: 'grey', marginLeft: 10 }}>
                  Created {moment(dateCreated).fromNow()} ·
              </span></span>
          </div>
          { children }
        </div>
      </DocumentTitle>
    );
  }
}
SurveyTitle.propTypes = {
  status: PropTypes.oneOf(['DRAFT', 'ACTIVE', 'LIVE']).isRequired,
  title: PropTypes.string.isRequired,
  dateCreated: PropTypes.instanceOf(Date).isRequired,
  children: PropTypes.node.isRequired,
};

export default SurveyTitle;
