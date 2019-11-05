import React, { Component } from 'react';
import PropTypes from 'prop-types';

export GudeOption from './GudeOption';

export default class GudeSelect extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
    rules: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    menuOpen: false,
  }

  onChange(value) {
    if (this.props.value !== value) {
      this.props.onChange(value);
    }

    this.onToggleMenu();
  }

  onClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onFieldChanged(event) {
    const { name, value } = event.target;
  }

  onToggleMenu(event) {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { onClick: this.onChange });
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ top: -24, left: 0, position: 'absolute', boxShadow: this.state.menuOpen ? '0px 0px 3px #d9d9d9' : 'none', width: this.state.menuOpen ? 200 : 'max-content' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: this.state.menuOpen ? 'solid 1px #d9d9d9' : 'none', height: 50, padding: '0 0 0 10px' }}>
            {
              !this.props.rules.length ? (
                <div>
                  <span>Select logic type</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {/*
                  <b>{this.props.value.ruletype.toUpperCase()}</b>
                  */}
                  <b style={{ color: '#6d6e71' }}>BETWEEN:</b>
                  {
                    this.props.rules.find((rule) => rule.ruletype.toLowerCase() === 'btw') ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', margin: '0 10px 0 0' }}>
                        <span style={{ margin: '0 10px', color: '#6d6e71' }}>{this.props.rules.find((rule) => rule.ruletype.toLowerCase() === 'btw').value.split(',')[0]}</span>
                        {/*
                        <input type="number" name="fromValue" onChange={this.onFieldChanged} onClick={this.onClick} min={0} max={10} style={{ width: 40, height: 20, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                        */}
                        <b style={{ color: '#6d6e71' }}>AND</b>
                        <span style={{ margin: '0 10px', color: '#6d6e71' }}>{this.props.rules.find((rule) => rule.ruletype.toLowerCase() === 'btw').value.split(',')[1]}</span>
                        {/*
                        <input type="number" name="toValue" onChange={this.onFieldChanged} onClick={this.onClick} min={0} max={10} style={{ width: 40, height: 20, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                        */}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', margin: '0 10px' }}>
                        <input type="number" name="value" onChange={this.onFieldChanged} onClick={this.onClick} min={0} max={10} style={{ width: 40, height: 20, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                      </div>
                    )
                  }
                </div>
              )
            }
            {/*
            <i onClick={this.onToggleMenu} className="material-icons" style={{ color: '#d9d9d9', margin: 'auto 10px auto 0' }}>keyboard_arrow_down</i>
            */}
          </div>
          {
            this.state.menuOpen ? (
              <div style={{ width: '100%' }}>
                {childrenWithProps}
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
}
