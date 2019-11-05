import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import enhanceWithClickOutside from 'react-click-outside';
import questionTypes from './questiontypes';
import styled from 'styled-components';

import styles from './AddQuestionFAB.css';
const AddQuestionFABWrapper = styled.div`${styles}`

const visibleQuestionTypes = questionTypes.filter((questionType) => {
  if (questionType.key === 'OPEN_ENDED' || questionType.key === 'MULTIPLE_CHOICE_SINGLE_SELECT' || questionType.key === 'OPEN_ENDED_INTEGER' || questionType.key === 'OPEN_ENDED_RANGE_0_10') {
    return true;
  }
  return false;
});

class AddQuestionFAB extends Component {
  static propTypes = {
    onAddQuestion: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    this.onMenuExpanded = this.onMenuExpanded.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
  }

  state = {
    expanded: false,
  }

  onCollapse() {
    this.setState({ expanded: false });
  }

  onMenuExpanded() {
    this.setState({ expanded: !this.state.expanded });
  }

  handleClickOutside() {
    this.setState({ expanded: false });
  }

  render() {
    let portal = document.getElementById('portal-container');
    if (!portal) {
      portal = document.createElement('div');
      portal.setAttribute('id', 'portal-container');
      document.getElementById('app').appendChild(portal);
    }

    return createPortal (
      <AddQuestionFABWrapper className="add-question-fab" style={{ position: 'absolute', right: 100, bottom: 100, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {
          !this.state.expanded ? (
            <Popup
              trigger={(
                <Button
                  className="main"
                  style={{ height: 80, width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 40 }}
                  onClick={this.onMenuExpanded}
                >
                  <i className="material-icons" style={{ fontSize: 40, color: '#fff', margin: 10 }}>add</i>
                </Button>
              )}
              content="Add New Question"
              position="left center"
              basic
              inverted
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            />
          ) : (
            <div>
              {
                visibleQuestionTypes.map((questionType) => {
                  let titleInitials = '';

                  questionType.title.split(' ').forEach((segment) => {
                    titleInitials = `${titleInitials}${segment[0].toUpperCase()}`;
                  });

                  return (
                    <Popup
                      trigger={(
                        <Button className="fab-action" onClick={() => { this.props.onAddQuestion(questionType); this.setState({ expanded: false }); }}>
                          <span>{titleInitials}</span>
                        </Button>
                      )}
                      content={questionType.title}
                      position="left center"
                      basic
                      inverted
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                    />
                  );
                })
              }
              <Popup
                trigger={(
                  <Button className="fab-action" onClick={() => { this.props.onAddNPSSection(); this.setState({ expanded: false }); }}>
                    <span>NS</span>
                  </Button>
                )}
                content="NPS Section"
                position="left center"
                basic
                inverted
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
              />
              <Button className="fab-action" onClick={this.onCollapse}>
                <i className="material-icons" style={{ fontSize: 40, color: '#fff', margin: 10 }}>close</i>
              </Button>
            </div>
          )
        }
      </AddQuestionFABWrapper>,
      document.getElementById('portal-container') // #portal-container is defined in the layout component
    );
  }
}

export default enhanceWithClickOutside(AddQuestionFAB);
