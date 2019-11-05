/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import Textarea from 'react-expanding-textarea';
import uniqueId from 'lodash/uniqueId'; // IKR?? Yea we need unique regeneratable Ids for sortable
import PropTypes from 'prop-types';

import CircularButton from 'SharedComponents/circular-button';

import questionTypes from './questiontypes';
import Question from './Question';
import './Answers.css';

const styles = {
  classEditing: {
    margin: 0,
    padding: 20,
  },
};

class Answer extends React.Component {
  static propTypes = {
    answer: PropTypes.object,
    type: PropTypes.object,
    updateAnswer: PropTypes.func,
    disabled: PropTypes.bool,
    onDelete: PropTypes.func,
    isCommenting: PropTypes.bool,
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
    // this.onAddQuestionGroup = this.onAddQuestionGroup.bind(this);
  }

  onTextChange(event) {
    event.preventDefault();
    const { updateAnswer, answer } = this.props;
    const { questions } = answer;

    const answerId = answer.id;
    updateAnswer(answerId, { text: event.target.value, questions });
  }

  onDeleteQuestion(id) {
    const { answer, updateAnswer } = this.props;
    const { questions, text } = answer;

    const newQuestions = questions.filter((question) => parseInt(question.id) !== parseInt(id));

    const answerId = answer.id;

    updateAnswer(answerId, { text, questions: newQuestions });
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

  addFollowUpQuestion() {
    const { answer, updateAnswer } = this.props;
    const { questions, id, text } = answer;

    const newQuestion = { id: uniqueId(), text: '', answers: [], type: questionTypes[0] };

    const answerId = answer.id;

    updateAnswer(answerId, { text, questions: [...questions, newQuestion] });
  }

  render() {
    const { disabled, type, onDelete, answer, isCommenting } = this.props;
    const { questions, id, fixed, text } = answer;

    const options = this.sortableOptions;
    let addFollowUpQuestion = (
      <CircularButton icon="add" onClick={this.addFollowUpQuestion} small backgroundColor="#f1f1f1" color="#919191" />
    );

    let removeAnswer = (
      <CircularButton icon="delete" onClick={() => onDelete(id)} small backgroundColor="#f1f1f1" color="#919191" />
    );

    if (type.key === 'INTRO_MESSAGE_MULTIPLE_CHOICE') {
      removeAnswer = null;
    }

    if (type.key === 'MULTIPLE_CHOICE_MULTIPLE_SELECT' || type.key === 'INTRO_MESSAGE_MULTIPLE_CHOICE') {
      addFollowUpQuestion = null;
    }

    let actions = !fixed ? (
      <div className="answer-actions" style={{ width: 'fit-content', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {addFollowUpQuestion}
        {removeAnswer}
      </div>
    ) : null;

    if (disabled) {
      actions = null;
    }

    return (
      <li data-answer-id={id}>
        <div className="question-box" style={{ boxShadow: 'none', border: 'solid 2px #d9d9d9' }}>
          <div
            className="answer-content"
            style={{
              display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 0,
            }}
          >
            <Textarea
              value={text}
              name="text"
              onChange={this.onTextChange}
              style={{ border: 'none', borderRadius: 0, padding: '15px 15px', margin: 0, backgroundColor: !isCommenting ? '#fff' : '#fafafa', overflow: 'hidden', resize: 'none', minHeight: 30, width: 'calc(100% - 10px)', color: '#6d6e71' }}
              placeholder="Type your answer option"
              rows={1}
            >
            </Textarea>
            { actions }
          </div>
        </div>
        <ul className="questions-list follow-up" id={`questions-list-${id}`}>
          {
            questions.map((question) => (
              <Question
                level={question.level}
                text={question.text}
                onDelete={this.onDeleteQuestion}
                updateQuestion={this.updateQuestion}
                id={question.id}
                key={question.id}
                answers={question.answers}
                type={question.type}
                fixed={question.fixed}
                rules={question.rules}
              />
            ))
          }
        </ul>
      </li>
    );
  }
}

export default Answer;
