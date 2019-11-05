import ConversationsAPI from '../apis/ConversationsAPI';
import { observable, action } from "mobx";


class CurrentConversationStore {

  @observable id = null

  @observable conversation = null;

  @observable loading = false;

  @observable errors = [];

  @observable activated = false;

  @observable activating = false;

  @observable sentOut = false;

  constructor(id = null){
    if(id)
    this.id = id;
  }

  setConversation(conversation) {
    this.loading = false;
    this.conversation = conversation;
    this.id = conversation.id;
  }

  throwError(err) {
    this.loading = false;
    this.errors.push(err);
  }

  @action
  createNewConversation(conversation) {
    this.loading = true;
    ConversationsAPI.create(conversation).then((newConversation) => {
      newConversation.body.data.isNew = true;
      this.setConversation({ ...newConversation.body.data });
    }).catch(err => {
      this.throwError(err);
    });
  }

  @action
  getSingle(id=null) {
    if(!id)
      throw new Error('Cant fetch survey without id');
    this.id = id;
    this.loading = true;
    ConversationsAPI.getSingle(this.id).then((newConversation) => {
      this.setConversation({ ...newConversation.body.data, ...this.conversation});
    }).catch(err => {
      this.throwError(err);
    });
  }

  @action
  activateConversation(id = null){
    this.loading = true;
    this.activating = true;
    ConversationsAPI.activate(id || this.id).then(() => {
      this.activated = true;
      this.activating = false;
    }).catch((err) => {
      this.throwError(err);
      this.activating = false;
    })
  }

  @action
  deleteConversation(conversationId) {
    this.loading = true;
    ConversationsAPI.delete(conversationId || this.id).then((success) => {
      this.setConversation(null);
    }).catch(err => {
      this.throwError(err);
    });
  }

  @action
  updateConversation(conversation, id=null) {
    this.loading = true;
    ConversationsAPI.update(conversation, id || this.id).then((newConversation) => {
      this.setConversation({ ...newConversation.body.data, ...this.conversation});
    }).catch(err => {
      this.throwError(err);
    });
  }

  @action
  sendToAudience(panelId, filters={}, conversationId = null){
    this.loading = true;
    const id = conversationId || this.id;
    if(!id)
      throw new Error('Attempting to send conversation without id');
    ConversationsAPI.pushToPanel(id, {
      ...filters,
      panelId
    }).then((response) => {
      this.sentOut = true;
      this.loading = false;
    }).catch((err) => {
      this.throwError(err);
    })
  }
}

export default CurrentConversationStore;
