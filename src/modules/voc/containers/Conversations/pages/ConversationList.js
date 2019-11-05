import React, { Component } from 'react';
import { connect } from 'react-redux';
import request from 'superagent';
import { Loader , Dimmer, Segment, Header, Icon, Button, Statistic, Modal, Label, Card } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Sparklines, SparklinesLine, SparklinesSpots, SparklinesBars } from 'react-sparklines';
import { observer } from "mobx-react";
import { autorun } from 'mobx';
import autobind from 'autobind-decorator';
import Case from "case";

import ConversationListItem from '.././components/ConversationListItem';
import Paginate from '../../../legacy/common/pagination/Paginate';
import Dimmable from '../../../legacy/common/lists/Dimmable';
import Placeholders from '../../../legacy/common/lists/Placeholders';

import ConversationsStore from '../stores/ConversationsStore';
@observer
class ConversationList extends Component {
  constructor(props){
    super(props);
    this.state = {
      conversations: [],
      meta: [],
      type: "ACTIVE",
      selected: [],
      modal: {
        show: false,
        title: null,
        message: null,
        action: ()=>null,
      }
    };

    this.conversationsStore = ConversationsStore;
  }
  @autobind
  onFetch(err, conversations){
    if(err){
      //toast.error('Could not Fetch list, something went wrong.');
    }
    this.setState({
      conversations: conversations && conversations.objects? conversations.objects: []
    })
  }

  @autobind
  onChangePage(page){
    const { store, location, history } = this.props;
    history.push(`${location.pathname}?page=${page}`);
    store.goToPage(page);
  }

  @autobind
  toggleModal(cb, reload = false){
    const { store } = this.props;
    this.setState({ modal : { ...this.state.modal, show:!this.state.modal.show }},() => {
      if(typeof cb ==='function')
        cb.call(null)
      if(reload)
        setTimeout(()=>{
          store.goToPage(store.page);
        }, 1500)
    })
  }

  @autobind
  onPrompt({ title, message}, callback, reload=false){
    this.setState({
      modal: {
        show: true,
        title,
        message,
        action: ()=>this.toggleModal(callback,reload)
      }
    })
  }


  componentDidMount(){
    const { store, type } = this.props;
    store.getConversations(type);
    this.handler = autorun(() => {
        this.setState({ conversations : [ ...store.conversations] })
    });
  }

  componentWillUnmount() {
    this.handler();
  }

  componentWillReceiveProps(nextProps) {
    const { store, type } = this.props;
    if(nextProps.type !== type)
      store.getConversations(nextProps.type);
  }

  render() {
    console.log(this.props, ConversationsStore);
    const { conversations, activeItem, modal} = this.state;
    const { generalStore, type, history } = this.props;
    const store = this.conversationsStore;
    let list = (<Card.Group  itemsPerRow={3}>
        {
          conversations.map((conversation)=>{
            return <ConversationListItem key={conversation.id} item={conversation} generalStore={generalStore} history={history} prompt={this.onPrompt}/>
          })
        }
      </Card.Group>);
    if(store.loading)
      list = (<Placeholders items={3}/>)
    return (
      <Dimmable
        itemsExpected={10}
        show={false}
        warning="You dont have any Surveys"
        actionText="Create New"
        >
        <Modal size="small" open={modal.show} onClose={this.toggleModal}>
          <Modal.Header>
            {modal.title}
          </Modal.Header>
          <Modal.Content style={{width:'80%'}}>
            <p>{modal.message}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button positive onClick={this.toggleModal}>
              No
            </Button>
            <Button negative content='Yes' onClick={modal.action} />
          </Modal.Actions>
        </Modal>
        <div className="top">
          <div className="name-box">
            <span>
              Conversations
            </span>
            <div className="extras">
              { store.total } Conversations
            </div>
          </div>
          <div className="options" id="options">
            <Label.Group className="actions">
              <Label style={{marginRight: '3em'}} as={Link} to="/conversations/new">New Conversation</Label>
              <Label to="/conversations" color={type == 'ACTIVE'?'grey':null} as={Link}>Active</Label>
              <Label to="/conversations/drafts" color={type == 'DRAFT'?'grey':null} as={Link}>Drafts</Label>
              <Label to="/conversations/closed" color={type == 'INACTIVE'?'grey':null} as={Link}>Closed</Label>
            </Label.Group>
          </div>
        </div>

        <div className="list">
          {list}
        </div>
        <Paginate
          display={!!conversations.length}
          itemsPerPage={store.perPage}
          totalCount={store.total}
          currentPage={store.page}
          onChangePage={this.onChangePage}
        />
      </Dimmable>
    );
  }
}

export default ConversationList;
