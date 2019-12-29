import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AccordionSection extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
  };

  onClick = () => {
    this.props.onClick(this.props.label);
  };

  render() {
    const {
      onClick,
      props: { isOpen, label },
    } = this;

    return (
      <div
        style={{
          background: '#F4F4F5',
          border: '2px solid #e8eaed',
          borderRadius: '2px',
          marginBottom: '10px',
          ...this.props.style
        }}
      >
        <div onClick={onClick} style={{ cursor: 'pointer', borderBottom: isOpen ? '2px solid #e8eaed' : 'none' }}>
          <div style={{ display: 'flex', padding: 10 }}>
            <div style={{ float: 'left', marginRight: 10 }}>
              {!isOpen && <i className="material-icons" style={{ fontSize: 20, margin: 0, padding: 0, color: '#6d6e71' }}>chevron_right</i>}
              {isOpen && <i className="material-icons" style={{ fontSize: 20, margin: 0, padding: 0, color: '#6d6e71' }}>keyboard_arrow_down</i>}
            </div>
            <span style={{ color: '#6d6e71', textTransform: 'capitalize' }}>{label}</span>
          </div>

        </div>
        {isOpen && (
          <div style={{ padding: 10, backgroundColor: '#FFFFFF' }}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default AccordionSection;