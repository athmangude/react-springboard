import React from 'react';
import { Icon, Header, Form, Checkbox, Label, Modal, Button, Card, Image, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import { observer } from 'mobx-react';
import Case from "case";
import { toast } from 'react-toastify';

import CurrentConversationStore from '.././stores/CurrentConversationStore';

import ReactPlaceholder from 'react-placeholder';

import './ConversationListItem.css';


const OBJECTIVES = {
  AOD: 'AOD',
  BASIC: 'BASIC',
  CS: 'CS'
};
class ConversationListItem extends React.Component {
  constructor(props) {
    super(props);
    const { item: conversation } = this.props;
    this.store = new CurrentConversationStore(conversation.id);
    this.deleteConversation = this.deleteConversation.bind(this);
    this.editConversation = this.editConversation.bind(this);
    this.activateConversation = this.activateConversation.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { item: conversation } = nextProps;
    this.store = new CurrentConversationStore(conversation.id);
  }

  activateConversation(e) {
    e.preventDefault();
    const store = this.store;
    const { prompt: modalPrompt, item: conversation } = this.props;
    modalPrompt({
      title: 'Activate Conversation?',
      message:
     `Are you sure you want to activate conversation [${conversation.title}].
      You wont be able to edit the questions anymore`,
    },
      store.activateConversation.bind(store),
      true
    );
  }

  editConversation(e){

  }

  sendConversation(e){

  }

  deleteConversation(e) {
    e.preventDefault();
    const store = this.store;
    const { prompt: modalPrompt, item: conversation } = this.props;
    modalPrompt({
      title: 'Delete Conversation?',
      message: `Are you sure you want to delete conversation [${conversation.title}]`,
    },
    store.deleteConversation.bind(store),
  );
  }

  downloadConversation(e) {
    e.preventDefault();
    const { item: conversation } = this.props;
  }
  render() {
    const { item: conversation, history } = this.props;
    const store = this.store;
    const isActive = conversation.status === 'ACTIVE';
    const OPTIONS = [
      {
        key: 'activate',
        text: 'Activate',
        disabled: isActive,
        onClick: this.activateConversation
      },
      {
        key: 'send',
        text: 'Send',
        disabled: !isActive,
        onClick: ()=>history.push(`/conversations/${conversation.id}/send`)
      },
      {
        key: 'edit',
        text: 'Edit',
        disabled: isActive,
        onClick: this.editConversation
      },
      {
        key: 'duplicate',
        text: 'Duplicate',
      },
      {
        key: 'close',
        text: 'Close',
        disabled: !isActive,
      },
      {
        key: 'delete',
        text: 'Delete',
        onClick: this.deleteConversation,
      },
    ];

    const pc = 100 * (conversation.completes / (conversation.target || 100));
    const showDot = (dot) => {
      const { date } = dot.payload;
      const { activity } = conversation;
      if (date === activity[activity.length - 1].date) {
        return <Dot {...dot} />
      }
      return false;
    };
    const extraSendouts = conversation.sendOuts.length > 1 ?
      <Label size="mini">+{conversation.sendOuts.length - 1}</Label> : null;
    const sendOut = conversation.sendOuts.length ?
      (<b>
        | <Icon name="users" /> <span>{conversation.sendOuts[0].audience.title} { extraSendouts }</span>
      </b>) : null;

    const { account } = this.props;
    const user = account.collaborators.find(collaborator => collaborator.id == conversation.userId);
    const activity = conversation.activity || [];
    const data = activity.length>10?activity:[...activity, ...Array(10 - activity.length).fill({ date: new Date(), total: 0 })];
    let viewResults = (<Button as={Link} to={`/conversations/${conversation.id}/reporting/aod`} fluid><Icon name="bar chart" />View Charts <Icon name="chevron right" /></Button>);
    if(conversation.objective == OBJECTIVES.CS){
      viewResults = (<Button as={Link} to={`/conversations/${conversation.id}/reporting/nps`} fluid><Icon name="bar chart" />View NPS Report <Icon name="chevron right" /></Button>);
    }
    if(conversation.completes === 0){
      viewResults = null;
    }


    return (
      <Card className="conversation-list-item" style={{ minHeight: 350, minWidth: 330, margin: '0 0 20px' }}>
        <Card.Content>
          <Card.Header>
            <i className="material-icons dusty-orange">chat</i>
            <div className="title"><Link to={`/conversations/${conversation.id}/reporting/aod`}>{ conversation.title }</Link> <br /> <span>{moment(conversation.createDate).fromNow()} | By: {Case.capital(user?user.firstName:'unkwown')} | JoinCode: {conversation.joincode}</span></div>
            <Dropdown
              className="item-actions"
              icon
              trigger={<Icon className="action" name="ellipsis horizontal" />}
              options={OPTIONS}
            />
          </Card.Header>
          <Card.Meta>
            <div className="item-favourite">
              <Icon name="empty star" size="large" />
            </div>
            <div className="item-actions">
              { viewResults }
            </div>

          </Card.Meta>
          <Card.Description>
            <BarChart className="simple-chart" maxBarSize={25} width={280} height={50} data={data}>
              <Bar dataKey='total'  fill='#d9d9d9'/>
            </BarChart>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Icon name="check circle" /> <span><b>Completions:</b> {conversation.completes} / {conversation.maxRespondents } </span> {sendOut}
        </Card.Content>
    </Card>
    );
  }
}

export default observer(ConversationListItem);
