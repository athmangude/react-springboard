import React from 'react';
import { Button, Loader, Label } from 'semantic-ui-react';

import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";

import Objectives from '.././components/Objectives';
import AudienceSegment from '.././components/AudienceSegment';
import TargetSegment from '.././components/TargetSegment';
import SurveySegment from '.././components/SurveySegment';
import ScheduleSegment from '.././components/ScheduleSegment';
import uniqueId from 'lodash/uniqueId'; //IKR?? Yea we need unique regeneratable Ids for sortable

import CreateConversationForm from '.././forms/CreateConversationForm';
import CurrentConversationStore from '.././stores/CurrentConversationStore';
import { toast } from 'react-toastify';

import { observer } from "mobx-react";
import { autorun } from 'mobx';

import { Link } from 'react-router-dom';

import {questionTypes} from '../components/questions/questiontypes.json';

const OBJECTIVES = [
  {
    key:"BASIC",
    name: "Basic Conversation",
    description: "Create a basic conversation",
    icon: "comments outline",
  },
  {
    key: "AOD",
    name: "Audience on Demand",
    description: "Converse with our audiences",
    icon: "users",
  },
  {
    key:"cs",
    name: "Customer Satisfaction",
    description: "Get your customer's insights",
    icon: "handshake"
  }
];

const SEGMENTS = [AudienceSegment, TargetSegment, SurveySegment, ScheduleSegment];
class SendConversation extends React.Component {
  constructor(props){
    super(props);
    this.form = new CreateConversationForm();
    this.state = {
      objective: OBJECTIVES[0],
      questions: [],
      schedule: 'immediately',
      audience: null,
      target: 100,
      title: null,
      loading: true,
      dirty: false,
      disableEdits: true
    }
    this.setConversation = this.setConversation.bind(this);
    this.onSend = this.onSend.bind(this);
    this.onChange = this.onChange.bind(this);
    this.store = new CurrentConversationStore();
  }

  componentDidMount() {
    const { history, match } = this.props;
    const { store } = this;
    this.handler = autorun(()=>{
      if(store.conversation){
        this.setConversation(store.conversation)
      }
      if(store.sentOut === true){
        toast("Conversation was sent out successfully");
        history.push('/conversations');
      }
    });
    const { id } = match.params;
    store.getSingle(id);
  }
  componentWillUnmount() {
    this.handler();
  }

  onChange(e, { name, value }){
    this.form.update({ [ name ] : value });
    this.setState({ [ name ] : value, dirty: true })
  }

  onSend(e){
    e.preventDefault();
    const { store } = this;
    const { audience, target } = this.state;
    store.sendToAudience(audience, {
      target: target || 100
    });
  }

  setConversation(conversation){
    const { title, objective, surveyJson, maxRespondents } = conversation;
    const newObjective = OBJECTIVES.find(o => o.key === objective);
    this.setState({
      title,
      objective: newObjective,
      questions: JSON.parse(surveyJson),
      target: maxRespondents,
    }, ()=>{
      this.form.set({
        title,
        objective: newObjective.key,
        questions: JSON.parse(surveyJson),
        target: maxRespondents
      })
    })
  }

  render () {
    const { store } = this;
    let { objective, questions, dirty, target, audience } = this.state;
    return (
      <section className="content">
        <div className="top">
          <div className="name-box">
            <span>
              Send Conversation
            </span>
          </div>
          <div className="options" id="options">
            <Label.Group className="actions">
              <Label style={{marginRight: '3em'}} as={Link} to="/conversations/new">New Conversation</Label>
              <Label to="/conversations" as={Link}>Active</Label>
              <Label to="/conversations/drafts" as={Link}>Drafts</Label>
              <Label to="/conversations/closed" as={Link}>Closed</Label>
            </Label.Group>
          </div>
        </div>

        <div className="new-box" id="new-conversation">
          <form className="ui form">
            <Objectives list={OBJECTIVES} active={objective} form={this.form} onChange={this.onObjectiveChange}/>
            {
              SEGMENTS.map((Segment) => {
                return(
                  <Segment {...this.state } form={this.form} onChange={this.onChange}/>
                )
              })
            }
            <div className="ui divider"></div>
            <Button><i className="cancel icon"></i> Cancel</Button>
            <div className="ui buttons right floated">
              <Button loading={store.loading} disabled={!target || !audience} color="red" onClick={this.onSend}><i className="send icon"></i> Send</Button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default observer(SendConversation);
