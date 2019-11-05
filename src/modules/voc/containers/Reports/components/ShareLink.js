import React, { Component } from 'react';
import Hashids from 'hashids';
import { Input, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import ActionButton from 'SharedComponents/action-button';

const generateSharedLink = (surveyId) => {
  const hashids = new Hashids('&%^%#$&^(*^&&^$%@#%@', 15);
  return hashids.encode(surveyId);
};

export default class ShareLink extends Component {
  static propTypes = {
    surveyId: PropTypes.string,
    margin: PropTypes.number,
    padding: PropTypes.number,
    isFetchingData: PropTypes.bool,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    surveyType: PropTypes.string,
  };

  state = {
    link: '',
  };

  onHidePublicLink = () => {
    this.setState({ showLink: false });
  };

  copyLinkToClipboard = () => {
    const inputText = document.getElementById('share-link');
    inputText.select();
    document.execCommand('copy');
    this.props.alertActions.addAlert({ type: 'success', message: 'Copied link to clipboard' });
    this.props.EventHandler.trackEvent({ category: 'ShareLink', action: 'copy link to clipboard', value: true });
  };

  previewSharedLink = (surveyId) => {
    const hashId = generateSharedLink(surveyId);
    const { surveyType } = this.props;
    this.setState({ link: window.location.origin.concat('/surveys/shared-link/').concat(`${hashId}/report/${surveyType.toLowerCase()}`) });
    this.props.EventHandler.trackEvent({ category: 'ShareLink', action: 'preview shared link', value: true });
  };

  render() {
    const { surveyId, isFetchingData, margin = 10, padding = 10 } = this.props;
    const { link } = this.state;
    return (
      <div style={{ width: '100%', margin, padding, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {isFetchingData ? (
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 30, height: 30, margin: '0 5px', float: 'right', textAlign: 'right' }} /></div>} />
        ) : (
          <Popup
            trigger={<ActionButton icon="share" text="Share" onClick={() => this.previewSharedLink(surveyId)} />}
            content={
              <div style={{ width: 300, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Input id="share-link" value={link} action={{ icon: 'clipboard', onClick: this.copyLinkToClipboard }} style={{ height: 33, color: '#58595b', width: '100%' }} />
              </div>
            }
            on="click"
            hideOnScroll
            flowing
            position="bottom left"
          />
        )}
      </div>
    );
  }
}

