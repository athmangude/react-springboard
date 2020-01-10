import React from 'react';
import PropTypes from 'prop-types';

import NPSGroup from './NPSGroup';

const NPSGroups = (props) => {
  const detractors = props.items.filter((item) => item.npsScore < 7);
  const passives = props.items.filter((item) => item.npsScore > 6 && item.npsScore < 9);
  const promoters = props.items.filter((item) => item.npsScore > 8);
  return (
    <div style={{ width: '100%' }}>
      <NPSGroup id="nps-group-detractors" type="detractors" configurations={props.configurations} items={detractors} collaborators={props.collaborators} homeActions={props.homeActions} isFetchingDetractorComments={props.isFetchingDetractorComments} fetchNPSComments={props.fetchNPSComments} npsFilters={props.npsFilters} />
      <NPSGroup id="nps-group-passives" type="passives" configurations={props.configurations} items={passives} collaborators={props.collaborators} homeActions={props.homeActions} isFetchingPassiveComments={props.isFetchingPassiveComments} fetchNPSComments={props.fetchNPSComments} npsFilters={props.npsFilters} />
      <NPSGroup id="nps-group-promoters" type="promoters" configurations={props.configurations} items={promoters} collaborators={props.collaborators} homeActions={props.homeActions} isFetchingPromoterComments={props.isFetchingPromoterComments} fetchNPSComments={props.fetchNPSComments} npsFilters={props.npsFilters} />
    </div>
  );
};

NPSGroups.propTypes = {
  items: PropTypes.array.isRequired,
  collaborators: PropTypes.array.isRequired,
  homeActions: PropTypes.object.isRequired,
  isFetchingPassiveComments: PropTypes.bool.isRequired,
  isFetchingPromoterComments: PropTypes.bool.isRequired,
  isFetchingDetractorComments: PropTypes.bool.isRequired,
  fetchNPSComments: PropTypes.func.isRequired,
  npsFilters: PropTypes.object.isRequired,
  configurations: PropTypes.object.isRequired,
};

export default NPSGroups;
