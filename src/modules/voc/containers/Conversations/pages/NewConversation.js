import React, { Component } from 'react';

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

import DefaultLayout from 'Layouts/default';


const OBJECTIVES = [
  {
    key:"BASIC",
    name: "Basic Conversation",
    description: "Create a basic conversation",
    icon: "comments outline",
    segments: [SurveySegment],

  },
  {
    key: "AOD",
    name: "Audience on Demand",
    description: "Converse with our audiences",
    icon: "users",
    segments: [AudienceSegment, TargetSegment, SurveySegment, ScheduleSegment]
  },
  {
    key:"cs",
    name: "Customer Satisfaction",
    description: "Get your customer's insights",
    icon: "handshake",
    segments: [AudienceSegment, SurveySegment, ScheduleSegment]
  }
]

@observer
class NewConversation extends Component {

  form = new CreateConversationForm();

  store = new CurrentConversationStore();

  constructor(props){
    super(props);
    this.state = {
      objective: OBJECTIVES[0],
      questions: [{ id: uniqueId(), level: 1, text: "Type Question Here", answers: [], type: questionTypes[0]}],
      schedule: 'immediately',
      audience: null,
      target: 100,
      title: null,
      loading: true,
      dirty: false
    }
    this.onObjectiveChange = this.onObjectiveChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onActivate = this.onActivate.bind(this);
    this.onSaveDraft = this.onSaveDraft.bind(this);
    this.afterCreate = this.afterCreate.bind(this);
    this.autoSave = this.autoSave.bind(this);
    this.autoSaver = setInterval(() => {
      const { dirty, title, objective } = this.state;
      const { generalStore } = this.props;
      const { store } = this;
      if(!dirty)
        return null;
      if((!store.conversation || !store.conversation.id)){
        store.createNewConversation({
          objective: objective.key,
          title: title || 'Draft ' + uniqueId(),
          accountId: generalStore.currentAccount.id,
        })
      } else {
        this.autoSave()
      }

      this.handler = autorun(() => {
        let { history } = this.props;
        if(store.conversation){
          this.setState({ dirty : false })
        }
        if(store.activated === true && history.location.pathname === "/conversations/new"){
          this.afterCreate(null, store.conversation);
        }

      });

    }, 60000) // every 60 seconds

  }

  autoSave() {
    const { objective, questions, audience, schedule, target, title  } = this.state;
    const { generalStore } = this.props;
    const { store } = this;
    const { conversation } = store;
      let survey = {
        statusSurvey: 'DRAFT',
        objective: objective.key,
        surveyJson: JSON.stringify(questions),
        schedule: schedule,
        panelId: audience? audience: null,
        maxRespondents: target,
        target: target,
        title: title || 'Draft ' + uniqueId(),
        accountId: generalStore.currentAccount.id,
        gender: "ALL",
      }
      if(!store.conversation || !store.conversation.id){
        store.createNewConversation({ ...conversation, ...survey})
      } else {
        store.updateConversation({ ...conversation, ...survey}, conversation.id);
      }

  }

  componentWillMount(){
    this.form.update({ objective: 'basic' });
  }
  componentWillUnmount() {
    clearInterval(this.autoSaver);
    this.handler();
  }

  onObjectiveChange(objective){
    this.form.update({ objective });
    this.setState({objective, dirty: true})
  }

  onChange(e, { name, value }){
    this.form.update({ [ name ] : value });
    this.setState({ [ name ] : value, dirty: true })
  }

  afterCreate(err, conversation){
    if(err)
      return toast.error("Conversation not created. Something went wrong")

    toast.success("Conversation successfully created");
    let { history } = this.props;
    history.push('/conversations');
  }

  onActivate(e){
    e.preventDefault();
    const { store } = this;
    store.activateConversation(store.conversation.id)
  }

  onSaveDraft(e){
    e.preventDefault();
    this.autoSave();
  }

  render() {
    let { objective, questions, dirty } = this.state;
    const { store } = this;
    return (
      <DefaultLayout>
        <section className="content">
          <div className="top">
            <div className="name-box">
              <span>
                New Conversation
              </span>
            </div>
            <div className="options" id="options">
              <Label.Group className="actions">
                <Label color="grey" style={{marginRight: '3em'}} as={Link} to="/conversations/new">New Conversation</Label>
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
                objective.segments.map((Segment) => {
                  return(
                    <Segment {...this.state } form={this.form} onChange={this.onChange}/>
                  )
                })
              }
              <div className="ui divider"></div>
              <Button><i className="cancel icon"></i> Cancel</Button>
              <div className="ui buttons right floated">
                  <Button disabled={!dirty || store.loading} onClick={this.onSaveDraft}>Save Draft</Button>
                  <div className="or"></div>
                <Button color="red" disabled={dirty} onClick={this.onActivate}>Save and Activate</Button>
              </div>
            </form>
          </div>
        </section>
      </DefaultLayout>
    );
  }
}

export default NewConversation;
