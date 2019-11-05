import {  observable, action } from "mobx";

import AODReportAPI from '.././apis/AODReportAPI';
import FiltersStore from './FiltersStore';

class AODStore {
  @observable responses = [];
  @observable questions = [];
  @observable progress = 0;
  @observable metadata = [];
  @observable surveyConfig = {};
  @observable loading = true;

  @action
  fetchData(id = null){
    this.loading = true;
    if (!id) {
      throw new Error('You cannot fetch responses without an id');
    }
    AODReportAPI.fetchResponses(id).then(({ body }) => {
      let {responses, questions, metadata, surveyConfig} = body.data;
      this.setData({
        responses, questions, metadata, surveyConfig
      })
    }).catch((err) => {
      this.setData({});
    })
  }

  setData(data = {}) {
    this.responses = data.responses || [];
    this.questions = data.questions || [];
    this.metadata = data.metadata || [];
    this.surveyConfig = data.surveyConfig[0] || {};
    this.loading = false;
  }
}

export default AODStore;
