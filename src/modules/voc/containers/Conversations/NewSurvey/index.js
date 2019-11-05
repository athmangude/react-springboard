/* eslint-disable jsx-a11y/href-no-hash, no-array-index-key, no-param-reassign, no-return-assign, no-nested-ternary, no-shadow, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { Button, Dimmer } from 'semantic-ui-react';
import ActionButton from 'SharedComponents/action-button-styled';
import { Form } from 'formsy-semantic-ui-react';
import uniqueId from 'lodash/uniqueId';
import Spinner from 'react-spinner-material';
import { throttle } from 'lodash';

// import TopBarLayout from 'Layouts/top-bar';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import withAuthentication from 'Utils/withAuthentication';
import ActivityHandler from 'Utils/ActivityHandler';

import Objectives from '../components/survey/objectives';
import TitleSegment from '../components/survey/segments/title';
import TargetSegment from '../components/survey/segments/target';
import AudienceSegment from '../components/survey/segments/audience';
import LanguageSegment from '../components/survey/segments/language';
import CountrySegment from '../components/survey/segments/country';
import SurveySegment from '../components/survey/segments/survey';
import ScheduleSegment from '../components/survey/segments/schedule';
import RetakeSegment from '../components/survey/segments/retake';
import IntervalSegment from '../components/survey/segments/intervals';
// import PoweredByMsurvey from '../components/survey/segments/powered-by-msurvey';

import questionTypes from '../components/survey/segments/survey/questions/questiontypes';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-place-holder';

import * as conversationActions from '../flux/actions';
import * as audiencesActions from 'Modules/voc/containers/Settings/Audiences/flux/actions';
import * as configurationsActions from '../../Configurations/flux/actions';
import * as languagesActions from 'Modules/voc/containers/Settings/Languages/flux/actions';

import '../index.css';

const objectives = [
  {
    key: 'BASIC',
    name: 'Opt in Survey',
    description: 'Users opt in to participate in survey',
    icon: 'input',
    segments: [TitleSegment, SurveySegment, LanguageSegment, CountrySegment, TargetSegment, RetakeSegment, IntervalSegment],

  },
  {
    key: 'AOD',
    name: 'Audience Survey',
    description: 'Survey is sent to existing audience',
    icon: 'people',
    segments: [TitleSegment, SurveySegment, LanguageSegment, CountrySegment, AudienceSegment, TargetSegment, ScheduleSegment, RetakeSegment, IntervalSegment],
  },
  {
    key: 'CS',
    name: 'NPS Survey',
    description: "Net Promoter Score survey", // eslint-disable-line
    icon: 'tag_faces',
    segments: [TitleSegment, SurveySegment, LanguageSegment, CountrySegment, AudienceSegment, TargetSegment, RetakeSegment, IntervalSegment],
  },
];

@connect((state) => ({
  authentication: state.authentication,
  configurations: state.configurations,
  loggedInUserRole: state.roles.loggedInUserRole,
  account: state.account,
}),
(dispatch) => ({
  conversationActions: bindActionCreators(conversationActions, dispatch),
  audiencesActions: bindActionCreators(audiencesActions, dispatch),
  configurationsActions: bindActionCreators(configurationsActions, dispatch),
  languagesActions: bindActionCreators(languagesActions, dispatch),
  dispatch,
}))
class NewSurvey extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    alertActions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    authentication: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    configurations: PropTypes.object,
    windowDimensions: PropTypes.object,
    conversationActions: PropTypes.object,
    audiencesActions: PropTypes.object,
    languagesActions: PropTypes.object,
    loggedInUserRole: PropTypes.object,
    account: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.onObjectiveChange = this.onObjectiveChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeMeta = this.onChangeMeta.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.onInvalidSubmit = this.onInvalidSubmit.bind(this);
    this.onValid = this.onValid.bind(this);
    this.onValidSubmit = this.onValidSubmit.bind(this);
    this.autoSave = this.autoSave.bind(this);
    this.onActivate = this.onActivate.bind(this);
    this.onSaveDraft = this.onSaveDraft.bind(this);
    this.onCreateNewConversation = this.onCreateNewConversation.bind(this);
    this.onViewConversations = this.onViewConversations.bind(this);
    this.addLevel = this.addLevel.bind(this);
    this.onDismissDimmer = this.onDismissDimmer.bind(this);
    this.onViewSurveyResults = this.onViewSurveyResults.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onPoweredByMsurveyChanged = this.onPoweredByMsurveyChanged.bind(this);
    this.onShowMoreTargetOptionsChanged = this.onShowMoreTargetOptionsChanged.bind(this);
    this.onRetakableChanged = this.onRetakableChanged.bind(this);
    this.getCountryCode = this.getCountryCode.bind(this);
    this.onFilterChanged = this.onFilterChanged.bind(this);
    this.onChangeCountryChanged = this.onChangeCountryChanged.bind(this);
  }

  state = {
    form: {
      objective: 'BASIC',
      questions: [
        {
          id: uniqueId(),
          level: 1,
          text: 'Hello! You are invited to take this survey. It is free to participate and you will get #incentive# #currency# airtime if you answer all. Continue?',
          fixed: true,
          answers: [
            {
              id: uniqueId(),
              level: '1.1',
              questions: [],
              text: 'YES',
              fixed: false,
              type: { key: 'ANSWER' },
            },
            {
              id: uniqueId(),
              level: '1.2',
              questions: [
                {
                  id: uniqueId(),
                  level: '1.2.1',
                  text: 'Thank you for your participation',
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 11),
                  rules: [],
                },
              ],
              text: 'NO',
              fixed: false,
              type: { key: 'ANSWER' },
            },
            {
              id: uniqueId(),
              level: '1.3',
              questions: [
                {
                  id: uniqueId(),
                  level: '1.3.1',
                  text: 'You will no longer be contacted for this survey',
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 11),
                  rules: [],
                },
              ],
              text: 'STOP',
              fixed: false,
              type: { key: 'ANSWER' },
            },
          ],
          type: questionTypes.find((questionType) => questionType.id === 14),
          rules: [],
        },
        {
          id: uniqueId(),
          level: 2,
          text: '',
          answers: [],
          type: questionTypes.find((questionType) => questionType.id === 1),
          rules: [],
        },
        {
          id: uniqueId(),
          level: '3',
          text: 'Thank you for your participation',
          fixed: true,
          answers: [],
          type: questionTypes.find((questionType) => questionType.id === 11),
          rules: [],
        },
      ],
      title: '',
      // target: 100,
      maxRespondents: 100,
      defaultIncentiveAmount: null,
      joincode: null,
      audience: null,
      age: { min: 0, max: 100 },
      gender: '',
      county: '',
      meta: {},
      scheduleType: 'IMMEDIATELY',
      runTime: null,
      retakable: false,
      retakeInterval: 0,
      retakeLimit: 0,
      participantTimeoutInterval: (1000 * 60 * 60 * 24 * 3), // 3 days
      surveyTimeoutInterval: (1000 * 60 * 60 * 24 * 30), // 30 days,
      poweredByMsurvey: true,
      country: null,
      language: null,
    },
    audienceFilters: {},
    fetchAudiencesError: false,
    savingConversation: false,
    activatingConversation: false,
    conversation: null,
    dimmed: false,
    errorMessage: null,
    successMessage: null,
    successfullyActivated: null,
    isFormValid: false,
    areNotificationsDisabled: true,
    validSubmit: null,
    showMoreTargetOptions: true,
  }

  componentDidMount() {
    this.fetchAudiences();
    this.getCountryCode();

    this.autoSaver = throttle(this.autoSave, 10000);

    this.intervalSave = setInterval(() => { // eslint-disable-line consistent-return
      this.autoSaver();
    }, 60000);

    setTimeout(() => {
      this.setState({ areNotificationsDisabled: false });
    }, 3000);
  }

  componentWillUnmount() {
    // this.autosaver.cancel();
    clearInterval(this.intervalSave);
  }

  onChange(event, { name, value }, updateRemote = null) {
    const { form } = this.state;
    this.setState({ form: { ...form, [name]: value } }, () => {
      if (updateRemote) {
        this.autoSaver();
      }
    });
  }

  onChangeMeta(event, { name, value }) {
    const { form } = this.state;
    this.setState({ form: { ...form, meta: { ...form.meta, [name]: value } } });
  }

  onCreateNewConversation() {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: 'survey', action: 'create new survey after survey creation' });
    this.setState({ dimmed: false });
  }

  onDismissDimmer() {
    const { EventHandler } = this.props;
    this.setState({ dimmed: false, successfullyActivated: null });
    EventHandler.trackEvent({ category: 'survey', action: 'dismiss successfully activate dimmer' });
  }

  onViewConversations() {
    const { EventHandler } = this.props;
    const { router } = this.context;
    this.setState({ dimmed: false });

    // track the event
    EventHandler.trackEvent({ category: 'survey', action: 'view conversation' });
    setTimeout(() => {
      router.history.push('/surveys');
    }, 1000);
  }

  onViewSurveyResults() {
    // track the event
    const { EventHandler } = this.props;
    const { router } = this.context;
    const { conversation } = this.state;
    EventHandler.trackEvent({ category: 'survey', action: 'view survey results' });
    setTimeout(() => {
      router.history.push(`/surveys/${conversation.id}/report/${conversation.objective.toLowerCase()}`);
    }, 1000);
  }

  onFilterChanged(filter) {
    this.setState({ audienceFilters: filter });
  }

  onPoweredByMsurveyChanged(checked) {
    const { form } = this.state;
    this.setState({ form: { ...form, poweredByMsurvey: checked } });
  }

  onRetakableChanged(retakable) {
    const { form } = this.state;
    if (retakable) {
      return this.setState({ form: { ...form, retakable } });
    }
    return this.setState({ form: { ...form, retakable, retakeInterval: 0, retakeLimit: 0 } });
  }

  onObjectiveChange(objective) { // eslint-disable-line consistent-return
    const { EventHandler, authentication } = this.props;
    const { form } = this.state;
    let { questions } = form;

    // track the event
    EventHandler.trackEvent({ category: 'survey', action: 'objective change', value: objective });

    if (objective === 'BASIC') {
      const firstQuestion = questions[0];
      const introQuestionKeys = questionTypes.filter((questionType) => questionType.key === 'INTRO_MESSAGE_MESSAGE' || questionType.key === 'INTRO_MESSAGE_MULTIPLE_CHOICE').map((question) => question.key);

      if (introQuestionKeys.includes(firstQuestion.type.key)) {
        // questions.shift();
        questions = questions.slice(1);
      }
      this.addLevel(questions);
      return this.setState({ form: { ...form, objective, questions } });
    }

    if (objective === 'AOD') {
      const firstQuestion = questions[0];

      const introQuestionKeys = questionTypes.filter((questionType) => questionType.key === 'INTRO_MESSAGE_MESSAGE' || questionType.key === 'INTRO_MESSAGE_MULTIPLE_CHOICE').map((question) => question.key);

      if (introQuestionKeys.includes(firstQuestion.type.key)) {
        // if (firstQuestion.type.key !== questionTypes.find((questionType) => questionType.id === 14).key) {
        //   questions.shift();
        //   const updatedQuestions = [{
        //     id: uniqueId(),
        //     level: 1,
        //     text: `${this.props.authentication.user.accounts.find((account) => account.id === this.props.authentication.user['x-account-id']).profilename} invites you to participate in a survey`,
        //     fixed: false,
        //     type: questionTypes.find((questionType) => questionType.id === 14),
        //     answers: [
        //       {
        //         id: uniqueId(),
        //         level: '1.1',
        //         questions: [],
        //         text: 'YES',
        //         fixed: false,
        //         type: { key: 'ANSWER' }
        //       },
        //       {
        //         id: uniqueId(),
        //         level: '1.2',
        //         questions: [
        //           {
        //             id: uniqueId(),
        //             level: '1.2.1',
        //             text: 'Thank you for your participation',
        //             fixed: false,
        //             answers: [],
        //             type: questionTypes.find((questionType) => questionType.id === 11),
        //           }
        //         ],
        //         text: 'NO',
        //         fixed: false,
        //         type: { key: 'ANSWER' },
        //       }
        //     ],
        //     rules: [],
        //   }].concat(questions);
        //
        //   this.addLevel(updatedQuestions);
        //   return this.setState({ form: { ...this.state.form, objective, questions: updatedQuestions } });
        // }

        questions = questions.slice(1);
        const updatedQuestions = [{
          id: uniqueId(),
          level: 1,
          text: 'Hello! You are invited to take this survey. It is free to participate and you will get #incentive# #currency# airtime if you answer all. Continue?',
          fixed: true,
          answers: [
            {
              id: uniqueId(),
              level: '1.1',
              questions: [],
              text: 'YES',
              fixed: false,
              type: { key: 'ANSWER' },
            },
            {
              id: uniqueId(),
              level: '1.2',
              questions: [
                {
                  id: uniqueId(),
                  level: '1.2.1',
                  text: 'Thank you for your participation',
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 11),
                  rules: [],
                },
              ],
              text: 'NO',
              fixed: false,
              type: { key: 'ANSWER' },
            },
            {
              id: uniqueId(),
              level: '1.3',
              questions: [
                {
                  id: uniqueId(),
                  level: '1.3.1',
                  text: 'You will no longer be contacted for this survey',
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 11),
                  rules: [],
                },
              ],
              text: 'STOP',
              fixed: false,
              type: { key: 'ANSWER' },
            },
          ],
          type: questionTypes.find((questionType) => questionType.id === 14),
          rules: [],
        }].concat(questions);

        this.addLevel(updatedQuestions);
        return this.setState({ form: { ...form, objective, questions: updatedQuestions } });
      }

      const updatedQuestions = [{
        id: uniqueId(),
        level: 1,
        text: 'Hello! You are invited to take this survey. It is free to participate and you will get #incentive# #currency# airtime if you answer all. Continue?',
        fixed: true,
        answers: [
          {
            id: uniqueId(),
            level: '1.1',
            questions: [],
            text: 'YES',
            fixed: true,
            type: { key: 'ANSWER' },
          },
          {
            id: uniqueId(),
            level: '1.2',
            questions: [
              {
                id: uniqueId(),
                level: '1.2.1',
                text: 'Thank you for your participation',
                fixed: false,
                answers: [],
                type: questionTypes.find((questionType) => questionType.id === 11),
                rules: [],
              },
            ],
            text: 'NO',
            fixed: false,
            type: { key: 'ANSWER' },
          },
          {
            id: uniqueId(),
            level: '1.3',
            questions: [
              {
                id: uniqueId(),
                level: '1.3.1',
                text: 'You will no longer be contacted for this survey',
                fixed: false,
                answers: [],
                type: questionTypes.find((questionType) => questionType.id === 11),
                rules: [],
              },
            ],
            text: 'STOP',
            fixed: false,
            type: { key: 'ANSWER' },
          },
        ],
        type: questionTypes.find((questionType) => questionType.id === 14),
        rules: [],
      }].concat(questions);

      this.addLevel(updatedQuestions);
      return this.setState({ form: { ...form, objective, questions: updatedQuestions } });
    }

    if (objective === 'CS') {
      // const firstQuestion = questions[0];
      //
      // const introQuestionKeys = questionTypes.filter((questionType) => {
      //   return questionType.key === 'INTRO_MESSAGE_MESSAGE' || questionType.key === 'INTRO_MESSAGE_MULTIPLE_CHOICE';
      // }).map((question) => question.key);
      //
      // if (introQuestionKeys.includes(firstQuestion.type.key)) {
      //   if (firstQuestion.type.key !== questionTypes.find((questionType) => questionType.id === 15).key) {
      //     questions.shift();
      //     const updatedQuestions = [{
      //       id: uniqueId(),
      //       level: 1,
      //       text: `${this.props.authentication.user.accounts.find((account) => account.id === this.props.authentication.user['x-account-id']).profilename} invites you to give feedback on their services`,
      //       fixed: false,
      //       type: questionTypes.find((questionType) => questionType.id === 15),
      //       answers: [],
      //     }].concat(questions);
      //
      //     this.addLevel(questions);
      //     return this.setState({ form: { ...this.state.form, objective, questions: updatedQuestions } });
      //   }
      // } else {
      //   const updatedQuestions = [{
      //     id: uniqueId(),
      //     level: 1,
      //     text: 'Type your introduction message',
      //     fixed: false,
      //     type: questionTypes.find((questionType) => questionType.id === 15),
      //     answers: [],
      //   }].concat(questions);
      //   this.addLevel(updatedQuestions);
      //   return this.setState({ form: { ...this.state.form, objective, questions: updatedQuestions } });
      // }

      questions = questions.slice(1);

      const updatedQuestions = [
        {
          id: uniqueId(),
          level: '1',
          text: `Hi #name#. ${authentication.user.accounts.find((account) => account.id === authentication.user['x-account-id']).profilename} invites you to participate in a survey`,
          fixed: true,
          answers: [
            {
              id: uniqueId(),
              level: '1.1',
              questions: [],
              text: 'YES',
              fixed: false,
              type: { key: 'ANSWER' },
            },
            {
              id: uniqueId(),
              level: '1.2',
              questions: [
                {
                  id: uniqueId(),
                  level: '1.2.1',
                  text: 'Thank you for your participation',
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 11),
                  rules: [],
                },
              ],
              text: 'NO',
              fixed: false,
              type: { key: 'ANSWER' },
              rules: [],
            },
            {
              id: uniqueId(),
              level: '1.3',
              questions: [
                {
                  id: uniqueId(),
                  level: '1.3.1',
                  text: 'You will no longer be contacted for this survey',
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 11),
                  rules: [],
                },
              ],
              text: 'STOP',
              fixed: false,
              type: { key: 'ANSWER' },
              rules: [],
            },
          ],
          type: questionTypes.find((questionType) => questionType.id === 14),
          rules: [],
        },
        {
          id: uniqueId(),
          level: '2',
          text: `On a scale of 0 to 10 (0-Less Likely, 10-Very Likely), how likely are you to recommend ${authentication.user.accounts.find((account) => account.id === authentication.user['x-account-id']).profilename} to your friends/family?`,
          answers: [
            {
              id: uniqueId(),
              level: '2.1',
              questions: [
                {
                  id: uniqueId(),
                  level: '2.1.1',
                  text: `What did you not like about ${authentication.user.accounts.find((account) => account.id === authentication.user['x-account-id']).profilename} today?`,
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 8),
                  rules: [{
                    ruletype: 'btw',
                    value: '0,6',
                  }],
                },
              ],
              text: '',
              fixed: false,
              type: { key: 'LOGICAL_BRANCH' },
              rules: [{
                ruletype: 'btw',
                value: '0,6',
              }],
            },
            {
              id: uniqueId(),
              level: '2.2',
              questions: [
                {
                  id: uniqueId(),
                  level: '2.2.1',
                  text: `What can ${authentication.user.accounts.find((account) => account.id === authentication.user['x-account-id']).profilename} improve on that will delight you next time?`,
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 8),
                  rules: [{
                    ruletype: 'btw',
                    value: '7,8',
                  }],
                },
              ],
              text: '',
              fixed: false,
              type: { key: 'LOGICAL_BRANCH' },
              rules: [{
                ruletype: 'btw',
                value: '7,8',
              }],
            },
            {
              id: uniqueId(),
              level: '2.3',
              questions: [
                {
                  id: uniqueId(),
                  level: '2.3.1',
                  text: `What impressed you about ${authentication.user.accounts.find((account) => account.id === authentication.user['x-account-id']).profilename} today?`,
                  fixed: false,
                  answers: [],
                  type: questionTypes.find((questionType) => questionType.id === 8),
                  rules: [{
                    ruletype: 'btw',
                    value: '9,10',
                  }],
                },
              ],
              text: '',
              fixed: false,
              type: { key: 'LOGICAL_BRANCH' },
              rules: [{
                ruletype: 'btw',
                value: '9,10',
              }],
            },
          ],
          type: questionTypes.find((questionType) => questionType.id === 7),
          fixed: false,
          rules: [],
        },
        {
          id: uniqueId(),
          level: '3',
          text: 'Thank you for your participation',
          fixed: true,
          answers: [],
          type: questionTypes.find((questionType) => questionType.id === 11),
          rules: [],
        },
      ];

      this.addLevel(updatedQuestions);
      return this.setState({ form: { ...form, objective, questions: updatedQuestions } });
    }
  }

  onChangeCountryChanged(option) {
    const { form } = this.state;

    this.setState({ form: { ...form, country: option.code } });
  }

  onInvalidSubmit() {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: 'survey', action: 'invalid submit' });
    this.setState({ validSubmit: false });
  }

  onValidSubmit() {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: 'survey', action: 'valid submit' });
    this.setState({ validSubmit: true });
  }

  onValid() {
    this.setState({ isFormValid: true, validSubmit: true });
  }

  onInvalid() {
    this.setState({ isFormValid: false });
  }

  onShowMoreTargetOptionsChanged(status) {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: 'survey', action: 'show more target options' });
    this.setState({ showMoreTargetOptions: status });
  }

  onReset() {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: 'survey', action: 'reset questionnaire builder' });
    this.form.reset();
    this.setState({
      form: {
        objective: 'BASIC',
        questions: [
          {
            id: uniqueId(),
            level: 1,
            text: '',
            fixed: true,
            answers: [
              {
                id: uniqueId(),
                level: '1.1',
                questions: [],
                text: 'NO',
                type: { key: 'ANSWER' },
                fixed: false,
              },
              {
                id: uniqueId(),
                level: '1.2',
                questions: [
                  {
                    id: uniqueId(),
                    level: '1.2.1',
                    text: 'Thank you for your participation',
                    fixed: false,
                    answers: [],
                    type: questionTypes.find((questionType) => questionType.id === 11),
                    rules: [],
                  },
                ],
                text: 'YES',
                type: { key: 'ANSWER' },
                fixed: false,
              },
            ],
            type: questionTypes.find((questionType) => questionType.id === 14),
            rules: [],
          },
          {
            id: uniqueId(),
            level: 2,
            text: '',
            answers: [],
            type: questionTypes.find((questionType) => questionType.id === 1),
            rules: [],
          },
        ],
        title: '',
        // target: 100,
        maxRespondents: 100,
        defaultIncentiveAmount: null,
        joincode: null,
        audience: null,
        age: { min: 0, max: 100 },
        gender: 'ALL',
        meta: {},
        scheduleType: 'IMMEDIATELY',
        runTime: null,
        retakable: false,
        retakeInterval: 0,
        retakeLimit: 0,
        participantTimeoutInterval: 0,
        surveyTimeoutInterval: 0,
        poweredByMsurvey: true,
      },
      conversation: null,
    });
  }

  async onActivate(sendNow = false) {
    const { EventHandler, conversationActions, alertActions } = this.props;
    const { conversation, form } = this.state;
    EventHandler.trackEvent({ category: 'survey', action: 'activate survey' });

    if (form.defaultIncentiveAmount === '' || form.defaultIncentiveAmount === null || form.defaultIncentiveAmount < 0) {
      alertActions.addAlert({ type: 'error', message: 'Incentive must be a minimum of 0' });
      return;
    }

    await this.autoSave(true); // save the conversation before activating it

    this.setState({ activatingConversation: true, dimmed: false, successfullyActivated: null });

    try {
      const onActivateResults = await conversationActions.activateConversation(conversation.id, sendNow);
      let successMessage = 'Oops! Something went wrong and we could not activate the survey. Please try again later.';

      if (Object.keys(onActivateResults.data).includes('Metadata')) {
        successMessage = onActivateResults.data.Metadata.message;
      }
      this.setState({
        dimmed: true,
        successMessage,
        loading: false,
        dirty: false,
        savingConversation: false,
        activatingConversation: false,
        successfullyActivated: true,
      });
    } catch (exception) {
      EventHandler.handleException(exception);
      let errorMessage = 'Oops! Something went wrong and we could not activate the survey. Please try again later.';

      if (Object.keys(exception).includes('message')) {
        errorMessage = exception.message;
      } else if (Object.keys(exception).includes('response')) {
        if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
          errorMessage = exception.response.data.message || errorMessage;
        }
      }
      this.setState({
        dimmed: true,
        successfullyActivated: false,
        errorMessage,
      });
    } finally {
      this.setState({ activatingConversation: false });
    }
  }

  onSaveDraft() {
    const { EventHandler } = this.props;
    EventHandler.trackEvent({ category: 'survey', action: 'save draft' });
    this.form.submit();
    this.autoSave(true);
  }

  getCountryCode() {
    const { authentication } = this.props;
    const { form } = this.state;
    const account = authentication.user.accounts.find((acc) => acc.id === authentication.user['x-account-id']);
    const country = authentication.user.countries.find((c) => c.id === account.countryId);

    this.setState({ form: { ...form, country: country.code } });
  }

  addLevel(array, levels) {
    levels = levels || [];
    array.forEach((o, i) => {
      o.level = levels.concat(i + 1).join('.');
      if (Array.isArray(o.answers)) {
        this.addLevel(o.answers, levels.concat(i + 1));
      }

      if (Array.isArray(o.questions)) {
        this.addLevel(o.questions, levels.concat(i + 1));
      }
    });
    // https://codepen.io/anon/pen/yzPVYQ
  }

  async autoSave(logAction = false) {
    const { authentication, conversationActions, alertActions, loggedInUserRole, dispatch } = this.props;
    const { dimmed, activatingConversation, conversation, form, audienceFilters } = this.state;
    if (dimmed || !loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      return;
    }

    if (activatingConversation) {
      return;
    }

    this.setState({
      savingConversation: true,
    });

    const { objective, questions, audience, scheduleType, maxRespondents, target, defaultIncentiveAmount, title, runTime, meta, joincode, poweredByMsurvey, retakable, retakeLimit, retakeInterval, participantTimeoutInterval, surveyTimeoutInterval, country, language } = form;
    const { selectedAge, selectedCounty, selectedGender, selectedEducationLevel, selectedEmploymentType, selectedRegion, selectedLsm } = audienceFilters;

    const survey = {
      statusSurvey: 'DRAFT',
      objective,
      surveyJson: JSON.stringify(questions),
      scheduleType,
      runTime,
      panelId: audience,
      maxRespondents,
      target: maxRespondents,
      defaultIncentiveAmount,
      joincode,
      // title: title || `Draft ${uniqueId()}`,
      title: title || '',
      accountId: authentication.user.id,
      retakable,
      retakeLimit,
      retakeInterval,
      language,
      participantTimeoutInterval,
      surveyTimeoutInterval,
      // poweredByMsurvey,
      age: selectedAge && selectedAge.length ? this.stringifyAge(selectedAge) : [],
      gender: selectedGender || 'ALL',
      county: selectedCounty,
      educationLevel: selectedEducationLevel,
      employmentType: selectedEmploymentType,
      lsm: selectedLsm,
      region: selectedRegion,
      // participantMetadata: meta,
      country,
    };

    if (!conversation || !conversation.id) {
      try {
        const createConversationResult = await conversationActions.createConversation({ ...conversation, ...survey }, logAction);

        this.setState({
          conversation: { ...createConversationResult.data.Data, isNew: true },
        });
      } catch (exception) {
        let errorMessage = 'Something went wrong and we could not create the survey. Please try again later!';

        if (Object.keys(exception).includes('message')) {
          errorMessage = exception.message;
        } else if (Object.keys(exception).includes('response')) {
          if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
            errorMessage = exception.response.data.message;
          }
        }
        alertActions.addAlert({ type: 'error', message: errorMessage });
        ActivityHandler.handleException(dispatch, exception);
      } finally {
        this.setState({
          savingConversation: false,
        });
      }
    } else {
      try {
        const updateConversationResult = await conversationActions.updateConversation({ ...conversation, ...survey }, conversation.id, logAction);
        this.setState({
          conversation: { ...updateConversationResult.data.Data, ...conversation },
        });
      } catch (exception) {
        let errorMessage = 'Something went wrong and we could not update the survey. Please try again later!';

        if (Object.keys(exception).includes('message')) {
          errorMessage = exception.message;
        } else if (Object.keys(exception).includes('response')) {
          if (Object.keys(exception.response).includes('data') && Object.keys(exception.response.data.message)) {
            errorMessage = exception.response.data.message;
          }
        }
        alertActions.addAlert({ type: 'error', message: errorMessage });
        ActivityHandler.handleException(dispatch, exception);
      } finally {
        this.setState({
          savingConversation: false,
        });
      }
    }
  }

  async fetchAudiences() {
    const { authentication, audiencesActions, EventHandler } = this.props;
    this.setState({ isFetchingAudiences: true });
    try {
      const getSelectableAudienceResult = await audiencesActions.fetchSelectableAudiences();
      const audienceList = [...getSelectableAudienceResult.data.Data.panelsOwned, ...getSelectableAudienceResult.data.Data.panelsSharedWithAccount];
      const audiences = audienceList.map((audience) => {
        const country = authentication.user.countries.find((aCountry) => aCountry.id === audience.countryId);
        return {
          key: audience.panelId,
          value: audience.panelId,
          flag: country ? country.code.toLowerCase() : '',
          text: audience.panelName,
          metadata: audience.metadata,
          respondents: audience.numParticipants,
        };
      });

      this.setState({
        audiences: [...audiences],
        fetchAudiencesError: false,
      });
    } catch (exception) {
      EventHandler.handleException(exception);
      this.setState({ fetchAudiencesError: true });
    } finally {
      this.setState({
        isFetchingAudiences: false,
      });
    }
  }

  stringifyAge(ages) {
    let array = [];

    array = ages.map((age) => `${parseInt(age[0], 10)}-${parseInt(age[1], 10)}`);

    return array;
  }

  render() {
    const { configurations, audiencesActions, languagesActions, EventHandler, loggedInUserRole, windowDimensions, account, authentication } = this.props;
    const { width } = windowDimensions;
    const { successMessage, dimmed, successfullyActivated, errorMessage, form, savingConversation, activatingConversation, isFormValid, conversation, validSubmit } = this.state;

    if (!loggedInUserRole || loggedInUserRole.name !== 'ADMIN') {
      return (
        <SimpleLayoutExtended>
          <GenericPagePlaceholder title="Restricted Access" text="Your account role does not allow you to create a survey" width={width} />
        </SimpleLayoutExtended>
      );
    }

    if (!account.active) {
      return (
        <SimpleLayoutExtended>
          <GenericPagePlaceholder title="Restricted Access" text="Your account is deactivated. You cannot create a new survey" />
        </SimpleLayoutExtended>
      );
    }

    return (
      <SimpleLayoutExtended className="new-survey">
        <div className="new-survey">
          <Dimmer.Dimmable dimmed={dimmed} blurring style={{ borderRadius: 0, border: 'none', boxShadow: 'none' }}>
            <Dimmer active={dimmed} inverted>
              {
                successfullyActivated === true ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', position: 'fixed', top: '35%', left: 0, right: 0 }}>
                    <div style={{ border: 'solid 1px #d9d9d9', borderRadius: 8, boxShadow: '0px 0px 10px #d9d9d9', width: 400, backgroundColor: '#fff' }}>
                      <div style={{ padding: 10, margin: 10 }}>
                        <b style={{ color: '#3d4553', fontSize: 16 }}>Conversation created scuccessfully!</b>
                      </div>
                      <div style={{ padding: 10, minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: '#3d4553' }}>
                          {successMessage}
                        </p>
                      </div>
                      <div style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <ActionButton text="View Conversations" onClick={this.onViewConversations} />
                        <ActionButton text="View Results" onClick={this.onViewSurveyResults} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', position: 'fixed', top: '35%', left: 0, right: 0 }}>
                    <div style={{ border: 'solid 1px #d9d9d9', borderRadius: 8, boxShadow: '0px 0px 10px #d9d9d9', width: 400, backgroundColor: '#fff' }}>
                      <div style={{ padding: 10, margin: 10 }}>
                        <b style={{ color: '#3d4553', fontSize: 16 }}>
                          {"Oops! That didn't go well"}
                        </b>
                      </div>
                      <div style={{ padding: 10, minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: '#3d4553' }}>
                          {errorMessage}
                        </p>
                      </div>
                      <div style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <ActionButton text="Dismiss" onClick={this.onDismissDimmer} />
                      </div>
                    </div>
                  </div>
                )
              }
            </Dimmer>
            <Container style={{ marginBottom: 40 }}>
              <Row style={{ width: '100%', margin: '10px 0px' }}>
                <Objectives options={objectives} configurations={configurations} active={form.objective} onChange={this.onObjectiveChange} />
              </Row>
              <Form ref={(f) => this.form = f} onValidSubmit={this.onValidSubmit} onInvalidSubmit={this.onInvalidSubmit} onValid={this.onValid} onInvalid={this.onInvalid}>
                {
                  objectives.filter((objective) => objective.key === form.objective)[0].segments.map((Segment, i) => (
                    <Row key={i} style={{ width: '100%', margin: 0 }}>
                      <Segment {...this.state} audiencesActions={audiencesActions} languagesActions={languagesActions} EventHandler={EventHandler} countries={authentication.user.countries} onShowMoreTargetOptionsChanged={this.onShowMoreTargetOptionsChanged} onChange={this.onChange} onChangeMeta={this.onChangeMeta} onFilterChanged={this.onFilterChanged} onPoweredByMsurveyChanged={this.onPoweredByMsurveyChanged} conversation={conversation} onRetakableChanged={this.onRetakableChanged} onRetakeLimitChanged={this.onRetakeLimitChanged} onRetakeIntervalChanged={this.onRetakeIntervalChanged} onChangeCountryChanged={this.onChangeCountryChanged} />
                    </Row>
                  ))
                }
                <Row style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 0, padding: 0 }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: 0, padding: 0 }}>
                    {/*
                    <div>
                      <Button style={{ height: 35, borderRadius: 17.5 }}><div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -5 }}><i className="material-icons" style={{ color: '#000', margit: '10px 10px' }}>close</i><span style={{ color: '#808285', fontSize: 12 }}>Cancel</span></div></Button>
                    </div>
                    */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', flexDirection: 'row' }}>
                      <ActionButton type="submit" text="Save&nbsp;Changes" primary icon="save" disabled={savingConversation || activatingConversation} loading={savingConversation} onClick={this.onSaveDraft} />
                      <ActionButton type="submit" text="Activate" loading={activatingConversation} primary icon="toggle_on" disabled={!isFormValid || activatingConversation || savingConversation || !conversation} onClick={() => this.onActivate(false)} />
                      {
                        (form.objective !== 'BASIC' && form.audience !== null) ? (
                          <ActionButton type="submit" text="Activate&nbsp;and&nbsp;Send&nbsp;Now" primary icon="send" loading={activatingConversation} disabled={form.objective === 'BASIC' || !isFormValid || activatingConversation || savingConversation || !conversation} onClick={() => this.onActivate(true)} />
                        ) : null
                      }
                    </div>
                  </div>
                </Row>
              </Form>
            </Container>
          </Dimmer.Dimmable>
          {
            savingConversation ? (
              <div className="saving-indicator">
                <Spinner spinnerColor="#fff" size={15} spinnerWidth={2} />
                &nbsp;&nbsp;
                <span>Saving changes</span>
              </div>
            ) : null
          }
          {
            (validSubmit === false && validSubmit !== null) ? (
              <div className="form-errors-indicator">
                <i className="material-icons">error_outline</i>
                &nbsp;&nbsp;
                <span>Complete the highlighted fields before you can activate your survey</span>
              </div>
            ) : null
          }
        </div>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(NewSurvey);
