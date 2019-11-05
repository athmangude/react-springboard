/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import IconList from '../../components/IconList';
import TearedList from '../../components/TearedList';

function paginate(data, currentPage, type) {
  let lowerLimit = 0;
  let upperLimit = 10;

  if (type == 'prev') {
    currentPage = currentPage == 0 ? 0 : currentPage - 1;
    lowerLimit = currentPage * 10;
    upperLimit = lowerLimit + 10;
  }

  if (type == 'next') {
    currentPage = currentPage + 1;
    lowerLimit = currentPage * 10;
    upperLimit = lowerLimit + 10;
  }

  const items = Object.keys(data).map((key) => ({ name: key, count: parseFloat(data[key]) }))
  .sort((a, b) => b.count - a.count)
  .map((item) => {
    const delta = (Math.random() * (1 - 0) + 0).toFixed(0);
    return ({ name: item.name, metrics: { count: { value: numeral(item.count).format('0.0 a').toUpperCase().replace(' ', '') }, performance: { value: `${(Math.random() * (20 - 0) + 0).toFixed(1)}%`, color: delta === '1' ? '#0f9d58' : '#db4437', icon: delta === '1' ? 'arrow_upward' : 'arrow_downward' } } });
  });

  return items.slice(lowerLimit, upperLimit);
}

export default class Locations extends Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    width: PropTypes.number,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    data: PropTypes.object,
    isLoadingDemographics: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.onPaginateNext = this.onPaginateNext.bind(this);
    this.onPaginatePrevious = this.onPaginatePrevious.bind(this);
    this.state = {
      teared: true,
      items: [],
      currentPage: 0,
    }
  }

  componentDidMount() {
    const { data = {} } = this.props;

    const items = paginate(data, 0, null);

    this.setState({ items });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data != nextProps.data) {
      const { data } = nextProps;

      const items = paginate(data, 0, null);

      this.setState({ items, currentPage: 0 });
    }
  }

  onPaginateNext() {
    const { data } = this.props;
    const { currentPage } = this.state;

    const items = paginate(data, currentPage, 'next');

    let newCurrentPage = currentPage + 1;
    
    this.setState({ currentPage: newCurrentPage, items});
  }

  onPaginatePrevious() {
    const { data } = this.props;
    const { currentPage } = this.state;

    const items = paginate(data, currentPage, 'prev');

    let newCurrentPage = currentPage == 0 ? 0 : currentPage - 1;

    this.setState({ currentPage: newCurrentPage, items});
  }

  render() {
    const { title, subtitle, data = {}, isLoadingDemographics, width, EventHandler, alertActions } = this.props;
    const { items, currentPage } = this.state;
    // const topComponent = items.length > 10 ? (<IconList list={items.slice(0, 5)} />) : null;
    // const bottomComponent = items.length > 10 ? (<IconList list={items.slice(-5)} />) : null;
    const fullComponent = (<IconList list={items} />);

    return (
      <TearedList
        isLoading={isLoadingDemographics}
        title={title}
        subtitle={subtitle}
        // topComponent={topComponent}
        // bottomComponent={bottomComponent}
        hiddenItems={items.length - 10}
        fullComponent={fullComponent}
        width={width}
        EventHandler={EventHandler}
        alertActions={alertActions}
        pagination={
          {
            show: Object.keys(data).length > 10,
            previous: ((currentPage * 10) + 10) > 10,
            next: ((currentPage * 10) + 10) < ((currentPage + 1 * 10) + 10)
          }
        }
        onPaginateNext={this.onPaginateNext}
        onPaginatePrevious={this.onPaginatePrevious}
      />
    );
  }
}

// export default Locations;

// const Locations = ({ title, subtitle, data = {}, isLoadingDemographics, width, EventHandler, alertActions }) => {
//   const items = Object.keys(data).map((key) => ({ name: key, count: parseFloat(data[key]) }))
//     .sort((a, b) => b.count - a.count)
//     .map((item) => {
//       const delta = (Math.random() * (1 - 0) + 0).toFixed(0);
//       return ({ name: item.name, metrics: { count: { value: numeral(item.count).format('0.0 a').toUpperCase().replace(' ', '') }, performance: { value: `${(Math.random() * (20 - 0) + 0).toFixed(1)}%`, color: delta === '1' ? '#0f9d58' : '#db4437', icon: delta === '1' ? 'arrow_upward' : 'arrow_downward' } } });
//     });

//   // console.log(items.slice(0, 10), items.slice(10, 20), items.slice(20, 30));  
//   console.log(paginate(items, 0, 'next'));

//   const topComponent = items.length > 10 ? (<IconList list={items.slice(0, 5)} />) : null;
//   const bottomComponent = items.length > 10 ? (<IconList list={items.slice(-5)} />) : null;
//   const fullComponent = (<IconList list={items} />);

//   return (
//     <TearedList
//       isLoading={isLoadingDemographics}
//       title={title}
//       subtitle={subtitle}
//       // topComponent={topComponent}
//       // bottomComponent={bottomComponent}
//       hiddenItems={items.length - 10}
//       fullComponent={fullComponent}
//       width={width}
//       EventHandler={EventHandler}
//       alertActions={alertActions}
//     />
//   );
// };

// Locations.propTypes = {
//   title: PropTypes.string,
//   subtitle: PropTypes.string,
//   width: PropTypes.number,
//   EventHandler: PropTypes.object,
//   alertActions: PropTypes.object,
//   data: PropTypes.object,
//   isLoadingDemographics: PropTypes.bool,
// };