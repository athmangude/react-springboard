import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react/dist/commonjs';
import Transition from 'react-motion-ui-pack';

export default class Alert extends Component {
  static propTypes = {
    message: PropTypes.string,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    removeAlert: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.close();
    }, 8000);
  }

  close() {
    this.props.removeAlert(this.props.id);
  }

  render() {
    let icon;
    let color;

    switch (this.props.type) {
      case 'info':
        icon = 'info';
        color = '#3d4553';
        break;
      case 'warning':
        icon = 'warning';
        color = '#e7a36d';
        break;
      case 'error':
        icon = 'error';
        color = '#DB2828';
        break;
      case 'success':
        icon = 'check_circle';
        color = '#67c13a';
        break;
      default:
        icon = 'info';
        color = '#3d4553';
    }

    return (
      <Transition
        enter={{ opacity: 1, translateY: 0 }}
        leave={{ opacity: 0, translateX: 0 }}
        component={false}
        runOnMount
      >
        <div key={this.props.id} style={{ backgroundColor: '#fff', padding: 10, margin: 10, width: 300, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: 70, border: 'solid 2px #d9d9d9', boxShadow: '0 0 3px #d9d9d9', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
            <i className="material-icons" style={{ fontSize: 50, color, margin: 10, alignSelf: 'flex-start' }}>{icon}</i>
            {this.props.message || 'Oops! Something went wrong. Please try again later.'}
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button onClick={this.close} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase' }}>
              DISMISS
            </Button>
          </div>
        </div>
      </Transition>
    );
  }
}
