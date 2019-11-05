import React from 'react'
import { Popup, Button, Accordion, Form, Menu, Header, Icon, Label } from 'semantic-ui-react';
import FiltersStore from './stores/FiltersStore';

import { observer } from 'mobx-react';
import moment from 'moment';

import autobind from 'autobind-decorator';

import MultiSelect from './filtertypes/MultiSelect';
import SingleSelect from './filtertypes/SingleSelect';
import DateRangeSelect from './filtertypes/DateRangeSelect';

const FILTERS = {
  participants: { title: "Participants", type: 'multiSelect', data: ['Promoters', 'Passives', 'Detractors'] },
  dateRange: { title: "Date Range", type: 'dateRange' },
  age: { title: "Age", type: 'multiSelect', data: ['>20', '20s', '30s', '40s', '50s', '60s', '<60'] },
  gender: { title: "Gender", type: 'singleSelect', data: ['All', 'Male', 'Female'] },
};

@observer
class Filters extends React.Component {
  state = { activeIndex: 0, dateRange: [ moment(), moment().add(1, 'months')] }

  @autobind
  handleClick(e, titleProps) {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  @autobind
  handleChange(e, {name, value, type, checked}){
    if(type === 'checkbox') {
      const filtersValue = FiltersStore[name];
      if(checked == false ){
        FiltersStore[name] = filtersValue.filter((_f) =>_f!=value)
      } else {
        FiltersStore[name].push(value)
      }
    }
    if(type == 'radio'){
      FiltersStore[name] = [value];
    }
  }

  @autobind
  handleDateChange(name, from, to){
    this.setState({[name]:[from, to]}, () => {
      FiltersStore[name] = [from.valueOf(), to.valueOf()];
    });
  }

  render () {
    const { activeIndex, dateRange } = this.state;
    const { active } = this.props;
    return (
      <section id="optional-details" className="side-box" style={{ padding: 0, width: '100%', margin: '10px 0' }}>
        <div style={{ width: '100%', height: 60, backgroundColor: '#d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
          <div><b>Filters</b></div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <i className="material-icons" style={{ color: '#58595b' }}>clear_all</i>&nbsp;<span style={{ color: '#58595b' }}>Clear All</span>
          </div>
        </div>
        <Accordion as={Menu} vertical style={{ width: '100%', borderRadius: 0, boxShadow: 'none', border: 'solid 2px #d9d9d9', backgroundColor: '#f9fafc', marginTop: 0 }}>
          {
            active.map((key, i) => {
              const filter = FILTERS[key];
              let content = null;
              switch (filter.type) {
                case 'multiSelect':
                  content = (<MultiSelect onChange={this.handleChange} name={key} data={filter.data}/>)
                break;
                case 'singleSelect':
                  content = (<SingleSelect onChange={this.handleChange} name={key} data={filter.data}/>)
                break;
                case 'dateRange':
                  content =(<DateRangeSelect dateRange={dateRange} onChange={this.handleDateChange} name={key}/>);
                break;
                case 'custom':
                  console.error("Not implemented");
                default:
              }
              return (
                <Menu.Item>
                  <Accordion.Title
                    active={true}
                    content={filter.title}
                    index={i}
                    onClick={this.handleClick}
                  />
                  <Accordion.Content active={true} content={content} />
                </Menu.Item>
              );
            })
          }
        </Accordion>
      </section>
    );
  }
}
export default Filters;
