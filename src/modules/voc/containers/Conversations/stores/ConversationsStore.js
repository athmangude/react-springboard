import ConversationsAPI from '../apis/ConversationsAPI';
import {  observable, action } from "mobx";

class ConversationsStore {

  @observable conversations = [];
  @observable type = "ACTIVE";
  @observable perPage = 9;
  @observable page = 1;
  @observable loading = true;
  @observable total = 0;

  @action
  getConversations(type = "ACTIVE", page = 1){
    this.type = type;
    this.page = page;
    this.goToPage(this.page)
  }

  @action
  getNext(){
    let { page } = this;
    page++;
    this.goToPage(page);
  }

  @action
  goToPage(page = 1){
    this.conversations = [];
    let { type, perPage } = this;
    this.loading = true;
    ConversationsAPI.getList(`type=${type}&limit=${perPage}&offset=${perPage * (page-1)}`).then((response)=>{
      const { meta, objects } = response.body.data;
      this.total = meta.totalCount;
      this.type = type;
      this.page = page;
      this.setData(objects);
    }).catch((e) => {
      this.throwError(e);
    })
  }

  @action
  getPrev(){
    let { page } = this;
    if(page <= 1)
      throw new Error("Pages start at 1");
    page--;
    this.goToPage(page);
  }

  @action
  setFavourite(id, favuorite = true){

  }

  @action
  changeMultiple(action="activate", ids = []){

  }

  @action
  setData(conversations) {
    this.loading = false;
    if(conversations)
      this.conversations = [ ... conversations ];
  }

  @action
  throwError(err) {
    this.loading = false;
  }
}

export default new ConversationsStore;
