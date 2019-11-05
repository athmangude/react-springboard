import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';
import uniqueId from 'lodash/uniqueId'; // IKR?? Yea we need unique regeneratable Ids for sortable
// import { Option, Select } from 'react-select-option';

import logicalBranchTypes from './logicalBranchTypes';
import GudeSelect, { GudeOption } from '../gude-select';

import questionTypes from './questiontypes';
import Question from './Question';
import './Answers.css';

class LogicBranch extends React.Component {
  static propTypes = {
    answer: PropTypes.object.isRequired,
    updateAnswer: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.sortableOptions = {
      handle: 'i.hand.pointer.icon',
      dataIdAttr: 'data-question-id',
    };

    this.updateText = this.updateText.bind(this);
    this.addFollowUpQuestion = this.addFollowUpQuestion.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.onDeleteQuestion = this.onDeleteQuestion.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onLogicalBranchTypeChanged = this.onLogicalBranchTypeChanged.bind(this);
  }

  onTextChange(event) {
    event.preventDefault();
    const { updateAnswer, answer } = this.props;
    const { questions } = answer;

    const answerId = answer.id;
    updateAnswer(answerId, { text: event.target.value, questions });
  }

  addFollowUpQuestion() {
    const { answer, updateAnswer } = this.props;
    const { questions, id, text } = answer;

    const newQuestion = { id: uniqueId(), text: '', answers: [], type: questionTypes[0] };

    const answerId = answer.id;

    updateAnswer(answerId, { text, questions: [...questions, newQuestion] });
  }

  onDeleteQuestion(id) {
    const { answer, updateAnswer } = this.props;
    const { questions, text } = answer;

    const newQuestions = questions.filter(question => parseInt(question.id) !== parseInt(id));

    const answerId = answer.id;

    updateAnswer(answerId, { text, questions: newQuestions });
  }

  onLogicalBranchTypeChanged(type) {
    this.props.updateLogicalBranch(this.props.answer.id, { logicalBranchType: type });
  }

  updateQuestion(id, updates) {
    const { answer, updateAnswer } = this.props;
    const { questions } = answer;
    const newQuestions = questions.map((question) => {
      if (parseInt(question.id) === parseInt(id)) {
        return { ...question, ...updates };
      }
      return question;
    });

    const answerId = answer.id;

    updateAnswer(answerId, { text: answer.text, questions: newQuestions });
  }

  updateText(text) {
    const { answer, updateAnswer } = this.props;
    const { questions } = answer;

    const answerId = answer.id;

    updateAnswer(answerId, { text, questions });
  }

  render() {
    const { disabled, answer } = this.props;
    const { questions, id, fixed } = answer;

    let actions = !fixed ? (
      <div className="answer-actions" style={{ width: 80 }}>
        <Popup
          trigger={<Icon onClick={this.addFollowUpQuestion} name="plus" />}
          content="Add Follow up Questions"
          position="right center"
        />
        <Popup
          trigger={<Icon name="remove" onClick={() => this.props.onDelete(id)} />}
          content="Delete Answer"
          position="right center"
        />
      </div>
    ) : null

    if (disabled) {
      actions = null;
    }

    return (
      <li data-answer-id={id}>
        <div className="question-box" style={{ boxShadow: 'none', border: 'solid 1px #d9d9d9' }}>
          <div className="answer-content" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 0, backgroundColor: '#fff', width: '100%', position: 'relative', border: 'solid 1px #d9d9d9', height: 50 }}>
            <GudeSelect
              rules={this.props.answer.rules}
              onChange={this.onLogicalBranchTypeChanged}
            >
              {
                logicalBranchTypes.map((logicalBranchType) => (
                  <GudeOption {...logicalBranchType} value={logicalBranchType.key} />
                ))
              }
            </GudeSelect>
            { actions }
          </div>
        </div>
        <ul className="questions-list follow-up" id={`questions-list-${id}`}>
          {
            questions.map((question) => {
              return <Question level={question.level} text={question.text} onDelete={this.onDeleteQuestion} updateQuestion={this.updateQuestion} id={question.id} key={ question.id } answers={question.answers} type={question.type} fixed={question.fixed} rules={question.rules} />
            })
          }
        </ul>
      </li>
    );
  }
}

export default LogicBranch;
