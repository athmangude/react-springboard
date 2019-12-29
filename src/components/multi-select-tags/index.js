/* eslint-disable jsx-a11y/href-no-hash, no-unused-vars */
/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import IconButton from '../icon-button';

class MultiSelectTag extends Component {
    static propTypes = {
      style: PropTypes.object,
      buttonStyle: PropTypes.object,
      optionStyle: PropTypes.object,
      searchable: PropTypes.bool,
      inverse: PropTypes.bool,
      showScrollBar: PropTypes.bool,
      selectedOptions: PropTypes.array,
      onChange: PropTypes.func.isRequired,
      placeholder: PropTypes.string,
      textTransform: PropTypes.string,
      type: PropTypes.string,
      removeFilter: PropTypes.func.isRequired,
    }

    constructor(props) {
      super(props);
      this.onToggleDropDown = this.onToggleDropDown.bind(this);
      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.onSearch = this.onSearch.bind(this);
      this.handleSearchedOptions = this.handleSearchedOptions.bind(this);
      this.onRemove = this.onRemove.bind(this);
      this.state = {
        isOpen: false,
        hoveredItem: null,
        searchText: '',
        options: [],
        selectedOptions: props.selectedOptions,
        searchedOptions: [],
      };
    }

    componentDidMount() {
      this.filterOptions();
    }

    // componentWillReceiveProps(nextProps) {
    //   const { selectedOptions } = this.props;
    //   if (nextProps !== this.props) {
    //     this.filterOptions(nextProps);
    //   }
    // }

    onToggleDropDown() {
      const { isOpen } = this.state;

      this.setState({ isOpen: !isOpen });
    }

    onMouseEnter(hoveredItem) {
      this.setState({ hoveredItem });
    }

    onMouseLeave() {
      this.setState({ hoveredItem: null });
    }

    onSelect(option) {
      const { onChange, type } = this.props;
      const { selectedOptions } = this.state;
      selectedOptions.push(option);
      onChange(type, selectedOptions);
      this.setState({ selectedOptions, isOpen: false, searchedOptions: [], searchText: '' }, () => this.filterOptions());
    }

    onSearch(event) {
      this.setState({ searchText: event.target.value }, () => this.handleSearchedOptions());
    }

    onRemove(index) {
      const { onChange, type } = this.props;
      const { selectedOptions } = this.state;

      selectedOptions.splice(index, 1);

      onChange(type, selectedOptions);
      this.setState({ selectedOptions, isOpen: false, searchedOptions: [], searchText: '' }, () => this.filterOptions());
    }

    handleSearchedOptions() {
      const { options, searchText } = this.state;

      this.setState({ searchedOptions: options.filter((option) => option.toLowerCase().includes(searchText.toLowerCase())) });
    }

    handleClickOutside() {
      this.setState({ isOpen: false });
    }

    filterOptions() {
      const { options: optionsList } = this.props;
      const { selectedOptions } = this.state;

      const options = optionsList.filter((option) => !selectedOptions.includes(option));

      this.setState({ options });
    }

    renderOptions() {
      const { placeholder, style, buttonStyle, textTransform, searchable, optionStyle, showScrollBar } = this.props;
      const { isOpen, hoveredItem, searchText, options: optionsList, searchedOptions } = this.state;
      const menu = style && Object.keys(style) ? style.menu : null;
      const optionStyles = optionStyle && Object.keys(optionStyle) ? optionStyle : null;
      const buttonStyles = buttonStyle && Object.keys(buttonStyle) ? buttonStyle : null;
      const textTransformOption = textTransform || null;
      const options = (searchedOptions.length) ? searchedOptions : optionsList;

      return (
        <div style={{ width: '100%' }}>
          {
            (options.length) ? (
              <div className="rule-configuration" style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgb(217, 217, 217)', borderTopLeftRadius: buttonStyles.borderRadius ? buttonStyles.borderRadius : 0, borderTopRightRadius: buttonStyles.borderRadius ? buttonStyles.borderRadius : 0, borderBottomLeftRadius: (!isOpen) ? buttonStyles.borderRadius ? buttonStyles.borderRadius : 0 : '0px', borderBottomRightRadius: (!isOpen) ? buttonStyles.borderRadius ? buttonStyles.borderRadius : 0 : '0px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', marginLeft: 0, width: '100%' }}>
                  <div className="mwamba-country-picker" style={{ width: '100%', position: 'relative', margin: '10px 0', ...style }}>
                    <div role="button" onClick={this.onToggleDropDown} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', height: 20, paddingLeft: 10 }}>
                      <div style={{ width: '100%' }}>
                        {
                          (searchable) ? (
                            <div style={{ width: '100%' }}>
                              <input
                                className="mwamba-input hide-active-border"
                                onChange={this.onSearch}
                                type="text"
                                name="name"
                                style={{ width: '100%' }}
                                value={searchText}
                                placeholder="Search"
                                autoComplete="off"
                              />
                            </div>
                          ) : (
                            <div>
                              <span>{placeholder || 'Add a an option'}</span>
                            </div>
                          )
                        }
                      </div>
                      <div>
                        <IconButton icon={!isOpen ? 'add' : 'close'} onClick={this.onToggleDropDown} style={{ margin: '1px 5px 3px', height: '30px', width: '30px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="add-validation-rule" style={{ border: 'dashed 1px #d9d9d9', padding: 10, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 185 }}>
                &nbsp;
                <span style={{ color: '#d9d9d9' }}>No more options</span>
              </div>
            )
          }
          {
            (isOpen && options.length) ? (
              <div className={showScrollBar ? 'options' : 'options hide-scroll-bar'} style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'absolute', top: 40, left: 0, border: '1px solid rgb(217, 217, 217)', backgroundColor: '#fff', zIndex: 1, borderBottomLeftRadius: buttonStyles.borderRadius ? buttonStyles.borderRadius : 0, borderBottomRightRadius: buttonStyles.borderRadius ? buttonStyles.borderRadius : 0, overflowY: 'scroll', maxHeight: '200px', ...menu }}>
                {
                  options.map((option, index) => (
                    <div className="option" role="button" onClick={() => this.onSelect(option)} onMouseEnter={() => this.onMouseEnter(index)} onMouseLeave={this.onMouseLeave} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer', backgroundColor: hoveredItem === index ? 'rgba(0, 0, 0, 0.1)' : '#fff', padding: '10px 10px', minHeight: 40 }}>
                      <span style={{ textTransformOption }}>{option}</span>
                    </div>
                  ))
                }
              </div>
            ) : null
          }
        </div>

      );
    }

    renderSelectedOptions() {
      const { type, removeFilter, textTransform } = this.props;
      const { selectedOptions } = this.state;
      const textTransformOption = textTransform || null;

      return (
        selectedOptions.map((option, index) => (
          <div style={{ position: 'relative', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgb(217, 217, 217)', padding: '3px 10px 0px 0px', margin: '5px 5px', borderRadius: '20px', height: '42px' }}>
              <IconButton icon="close" onClick={() => this.onRemove(index)} className="material-icons" style={{ margin: '4px 5px 3px', height: '30px', width: '30px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                <span style={{ color: 'black', textTransformOption }}>{option}</span>
              </div>
            </div>
          </div>
        ))
      );
    }

    render() {
      const { inverse } = this.props;

      return (
        <div style={{ flexWrap: 'wrap', display: 'flex' }}>
          {
            inverse ? this.renderSelectedOptions() : null
          }
          <div style={{ position: 'relative', width: (!inverse) ? '100%' : null, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '0px' }}>
            {
              this.renderOptions()
            }
          </div>
          {
            !inverse ? this.renderSelectedOptions() : null
          }
        </div>
      );
    }
}

export default enhanceWithClickOutside(MultiSelectTag);
