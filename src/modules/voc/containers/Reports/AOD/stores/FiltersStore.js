import {  observable, action, computed } from "mobx";

import queryString from 'query-string';
/**
  #One of the most important things in this app!
  # 40lines max!
  #Example
  age=['20-30','40-50']
  gender=['FEMALE']
  region=['Nairobi', 'Embu']
  dateRange=[new Date(2017,1,1), new Date(2017,1,12) ]
  participants = ['detractors', 'passives']
  customFilters = {
    branch: {
      title: 'Branch', ##optional
      filters:['Orbit', 'Yaya'],
      type: multiselect/singleselect/range/ ##optional default=multiselect,
      send: true ##optional Use false for for working with local filters
    }
    'some custom meta'
  }
*/

class FiltersStore {

  @observable age = [];
  @observable gender = [];
  @observable region = [];
  @observable dateRange = [];
  @observable participants = []; // QUESTION: This is mainly NPS??
  @observable customFilters = {};

  @computed get query(){
    const { age, gender, region, dateRange, participants } = this;
    const { customFilters } = this;
    let query = queryString.stringify({
      age,
      gender,
      region,
      dateRange,
      participants
    });
    const customFiltersKeys = Object.keys(customFilters);
    const customFiltersQuery = customFiltersKeys.map((key) => {
      if(customFilters[key].send)
        return queryString.stringify({ [key]: customFilters[key].filters })
    })

    return `${query}&${customFiltersQuery}`;

  }
  @action
  reset(key="age"){
    this[key] = null;
  }

}

export default new FiltersStore;
