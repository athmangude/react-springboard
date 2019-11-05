import {  observable, action } from "mobx";

import NPSReportAPI from '.././apis/NPSReportAPI';
import FiltersStore from './FiltersStore';

class NPSStore {
  @observable title = null;
  @observable status = null;
  @observable dateCreated = null;
  @observable score = null;
  @observable detractors = null;
  @observable promoters = null;
  @observable passives = null;
  @observable tags = [];
  @observable comments = [];

  @action
  fetchData(){
    NPSReportAPI.fetchData().then(({ body }) => {
      //const { title, status, dateCreated, score, detractors, promotes, passives} = body;
      //const { tags, comments } = body;
      this.setData({
        ...body
      })

    })
  }

  setData(data = {}){
    Object.assign(this, data);
  }
}

export default NPSStore;
