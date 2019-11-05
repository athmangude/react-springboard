import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Sortable from 'react-sortablejs';
import { Popup } from 'semantic-ui-react';
import uniqueId from 'lodash/uniqueId'; // IKR?? Yea we need unique regeneratable Ids for sortable
import { observer } from 'mobx-react';
import mouseTrap from 'react-mousetrap';
import autobind from 'autobind-decorator';
import styled from 'styled-components';

import questionTypes from './questiontypes';
import Question from './Question';
import './QuestionList.css';
import AddQuestionFAB from './AddQuestionFAB';
import SpeedDial from '../speed-dial';
import backgroundImage from '../../../../empty_list_background.png';

@mouseTrap
@observer
@connect((state) => ({
  authentication: state.authentication,
}))
class QuestionList extends React.Component {
  static propTypes = {
    authentication: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    bindShortcut: PropTypes.func.isRequired,
    unbindShortcut: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    conversation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      questions: [...props.questions] || [],
    };

    this.sortableOptions = {
      handle: 'i.hand.pointer.icon',
      dataIdAttr: 'data-question-id',
    };

    this.addQuestion = this.addQuestion.bind(this);
    this.addLevel = this.addLevel.bind(this);
    this.onAddNPSSection = this.onAddNPSSection.bind(this);
    this.onAddQuestionGroup = this.onAddQuestionGroup.bind(this);
  }

  componentDidMount() {
    this.props.bindShortcut(['command+q', 'ctrl+q'], this.addQuestion);
  }

  componentWillUnmount() {
    this.props.unbindShortcut(['command+q', 'ctrl+q']);
  }

  @autobind
  onReorderQuestions(order, sortable, evt) {
    const { questions, onChange } = this.props;

    let newQuestionsOrder = order.map((id) => questions.find((question) => question.id === id));

    const introQuestion = newQuestionsOrder.find((question) => {
      const introQuestionKeys = questionTypes.filter((questionType) => questionType.key === 'INTRO_MESSAGE_MESSAGE' || questionType.key === 'INTRO_MESSAGE_MULTIPLE_CHOICE').map((question) => question.key);
      return question.fixed && introQuestionKeys.includes(question.type.key);
    });


    const removedIntroQuestion = newQuestionsOrder.splice(newQuestionsOrder.indexOf(introQuestion), 1);
    newQuestionsOrder = [introQuestion].concat(newQuestionsOrder);

    const endQuestion = newQuestionsOrder.find((question) => {
      const introQuestionKeys = questionTypes.filter((questionType) => questionType.key === 'END_MESSAGE').map((question) => question.key);

      return question.fixed && introQuestionKeys.includes(question.type.key);
    });

    const removedEndQuestion = newQuestionsOrder.splice(newQuestionsOrder.indexOf(endQuestion), 1);
    newQuestionsOrder = newQuestionsOrder.concat(endQuestion);

    this.addLevel(newQuestionsOrder);

    onChange(null, { name: 'questions', value: newQuestionsOrder });
  }

  updateQuestion = (id, updates) => {
    const { questions, onChange } = this.props;
    const newQuestions = questions.map((question) => {
      if (parseInt(question.id) === parseInt(id)) {
        return { ...question, ...updates };
      }
      return { ...question };
    });

    this.addLevel(newQuestions);

    onChange(null, { name: 'questions', value: newQuestions }, true);
  }

  onAddQuestionGroup(id, newQuestion) {
    const { questions, onChange } = this.props;
    // const endQuestion = questions.find((question) => question.type.key === 'END_MESSAGE');

    newQuestion.id = id; // update new question id to id of question it's going to replace

    const newQuestions = questions.map((question, i) => {
      if (question.id === id) {
        return newQuestion;
      }

      return question;
    });

    this.addLevel([newQuestions]);

    onChange(null, { name: 'questions', value: [...newQuestions] }, true);
  }

  addQuestion(type) {
    const { questions, onChange } = this.props;
    const endQuestion = questions.find((question) => question.type.key === 'END_MESSAGE');

    const question = {
      id: uniqueId(), text: '', answers: [], type, rules: [],
    };

    const newQuestions = [...questions.filter((question) => question.id !== endQuestion.id), question, endQuestion];
    this.addLevel(newQuestions);

    onChange(null, { name: 'questions', value: [...newQuestions] });
  }

  onAddNPSSection() {
    const npsSection = {
      id: uniqueId(),
      level: '2',
      text: `On a scale of 0 to 10 (0-Less Likely, 10-Very Likely), how likely are you to recommend ${this.props.authentication.user.accounts.find((account) => account.id === this.props.authentication.user['x-account-id']).profilename} to your friends/family?`,
      answers: [
        {
          id: uniqueId(),
          level: '2.1',
          questions: [
            {
              id: uniqueId(),
              level: '2.1.1',
              text: `What did you not like about ${this.props.authentication.user.accounts.find((account) => account.id === this.props.authentication.user['x-account-id']).profilename} today?`,
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
              text: `What can ${this.props.authentication.user.accounts.find((account) => account.id === this.props.authentication.user['x-account-id']).profilename} improve on that will delight you next time?`,
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
              text: `What impressed you about ${this.props.authentication.user.accounts.find((account) => account.id === this.props.authentication.user['x-account-id']).profilename} today?`,
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
    };

    const { questions, onChange } = this.props;

    const endQuestion = questions[questions.length - 1];

    const newQuestions = [...questions.filter((question) => question.id !== endQuestion.id), npsSection, endQuestion];
    this.addLevel(newQuestions);

    onChange(null, { name: 'questions', value: [...newQuestions] });
  }

  @autobind
  onDelete(id) {
    const { questions, onChange } = this.props;

    const newQuestions = questions.filter((question) => question.id !== id);
    this.addLevel(newQuestions);

    onChange(null, { name: 'questions', value: newQuestions });
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

  findNext(nodeItems, level) {
    if (nodeItems) {
      for (let i = 0; i < nodeItems.length; i++) {
        if (nodeItems[i].level == level) {
          return nodeItems[i];
        }
        const found = this.findNext(nodeItems[i].questions && nodeItems[i].questions.length ? nodeItems[i].questions : nodeItems[i].answers, level);
        if (found) return found;
      }
    }
  }

  render() {
    const { questions } = this.props;
    const { disabled } = this.props;
    const options = this.sortableOptions;
    const Span = styled.span`
      background: #fafafa;
      font-size: 25px;
      position: relative;
      line-height: 1;
      text-align: center;
      display:block;
      margin-left:auto;
      margin-right:auto;
    `;
    const questionListing = (
      <Sortable key="main" options={options} onChange={this.onReorderQuestions} tag="ul" id={`questions-list-${uniqueId()}`} className="questions-list">
        {
          questions
            ? questions.map((question) => (
              <Question
                level={question.level}
                text={question.text}
                onDelete={this.onDelete}
                updateQuestion={this.updateQuestion}
                id={question.id}
                key={question.id}
                answers={question.answers}
                type={question.type}
                fixed={question.fixed}
                rules={question.rules}
                onAddQuestionGroup={this.onAddQuestionGroup}
              />
            ))
            : (
              <Span>
                <img
                  src={backgroundImage}
                  style={{
                    height: '50%', width: '50%', backgroundColor: '#fafafa', margin: '10px 10px', padding: '10px 10px',
                  }}
                />
                <p>Questions for this survey are not available.</p>
              </Span>
            )
        }
      </Sortable>
    );

    if (disabled) {
      <ul id={`questions-list-${uniqueId()}`} className="questions-list">
        {
          questions
            ? questions.map((question) => (
              <Question
                disabled
                level={question.level}
                text={question.text}
                onDelete={this.onDelete}
                updateQuestion={this.updateQuestion}
                id={question.id}
                key={question.id}
                answers={question.answers}
                type={question.type}
                fixed={question.fixed}
                rules={question.rules}
                onAddQuestionGroup={this.onAddQuestionGroup}
              />
            )) : (
              <Span>Questions for this survey are not available.</Span>
            )
        }
      </ul>;
    }

    return (
      <div
        className="question-list"
        style={{
          width: '100%', display: 'flex', flexDirection: 'column', position: 'relative',
        }}
      >
        <div className="questions-bg" style={{ backgroundColor: 'transparent' }}>
          <div className="questions-container">
            {questionListing}
          </div>
        </div>
        {
          this.props.conversation && this.props.conversation.status === 'ACTIVE' ? null : (
            <SpeedDial onAddQuestion={this.addQuestion} onAddNPSSection={this.onAddNPSSection} />
          )
        }
      </div>
    );
  }
}

export default QuestionList;
