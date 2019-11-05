/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary, no-shadow */
import React from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

const IconList = ({ list }) =>(      
  <div style={{ width: '100%' }}>
    {
      list.map((item, index) => (
        <Item key={item.name} item={item} last={list.length === index + 1} />
      ))
    }
  </div>
);

IconList.propTypes = {
  list: PropTypes.array,
};

export default IconList;
