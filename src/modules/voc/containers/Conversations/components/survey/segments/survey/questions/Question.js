/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from "react";
import PropTypes from "prop-types";
import {
  Icon,
  Popup,
  Modal,
  Button,
  Form,
  Header,
  Input
} from "semantic-ui-react";
// import { RIETextArea } from 'riek';
import Sortable from "react-sortablejs";
import uniqueId from "lodash/uniqueId";
import Textarea from "react-expanding-textarea";

import CircularButton from "SharedComponents/circular-button";

import Answer from "./Answer";
import LogicalBranch from "./LogicalBranch";
import questionTypes from "./questiontypes";
import questionGroups from "./questionGroups";
import ValidationRules from "./validation-rules";
import MwambaDropDownSelectDescriptive from "SharedComponents/mwamba-dropdown-select-descriptive";
import "./Question.css";

const transformedQuestionTypes = questionTypes
  .concat(questionGroups)
  .map(questionType => ({
    ...questionType,
    label: questionType.title,
    value: questionType.key
  }));

// @mouseTrap
class Question extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    answers: PropTypes.array.isRequired,
    fixed: PropTypes.bool,
    updateQuestion: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    rules: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      // text: props.text,
      // id: props.id,
      // type: props.type || questionTypes[0],
      // answers: props.answers,
      hover: false,
      modalOpen: false,
      isConfigure: false,
      configuration: {}
      // fixed: props.fixed,
      // rules: props.rules || [],
      // level: props.level,
    };

    this.updateText = this.updateText.bind(this);
    this.checkDuplicateAnswer = this.checkDuplicateAnswer.bind(this);
    this.onReorderAnswers = this.onReorderAnswers.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.onQuestionTypeChange = this.onQuestionTypeChange.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
    this.updateLogicalBranch = this.updateLogicalBranch.bind(this);
    this.toggleConfig = this.toggleConfig.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onUpdateValidationRules = this.onUpdateValidationRules.bind(this);
    this.sortableOptions = {
      handle: "i.hand.pointer.icon",
      dataIdAttr: "data-answer-id"
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.setState({
        text: nextProps.text,
        id: nextProps.id,
        type: nextProps.type || questionTypes[0],
        answers: nextProps.answers,
        fixed: nextProps.fixed,
        rules: nextProps.rules || [],
        level: nextProps.level
      });
    }
  }

  onDeleteAnswer = id => {
    const { answers, updateQuestion, type, configuration, text } = this.props;

    const newAnswers = answers.filter(answer => answer.id !== id);

    const questionId = this.props.id;

    updateQuestion(questionId, {
      text,
      answers: newAnswers,
      type,
      configuration
    });
  };

  onReorderAnswers(order) {
    const { answers, updateQuestion, type, configuration } = this.props;

    const newAnswersOrder = order.map(id =>
      answers.find(answer => answer.id === id)
    );

    updateQuestion(id, { text, answers: newAnswersOrder, type, configuration });
  }

  onQuestionTypeChange(option) {
    const type = transformedQuestionTypes.find(
      qType => option.key === qType.key
    );

    const { answers, updateQuestion, configuration, id, text } = this.props;

    updateQuestion(id, {
      text,
      answers,
      type,
      configuration,
      ...(Object.keys(option).includes("body") ? { ...option.body } : {})
    });
  }

  onTextChange(event) {
    const text = event.target.value;

    // IDEA: Leaving it here coz it might come in handy when they decide to enforce the hard character limit
    // const count = this.state.answers.reduce((accumulator, currentValue) => accumulator + currentValue.text.length + 3, text.length);

    const { answers, updateQuestion, type, configuration, id } = this.props;

    updateQuestion(id, { text, answers, type, configuration });
  }

  onUpdateValidationRules(validationRules) {
    const {
      answers,
      updateQuestion,
      type,
      configuration,
      id,
      text
    } = this.props;

    updateQuestion(id, {
      text,
      answers,
      type,
      configuration,
      rules: validationRules
    });
  }

  toggleConfig() {
    this.setState({ isConfigure: !this.state.isConfigure });
  }

  updateTree() {
    const { id, text, type, answers, configuration } = this.state;
    this.props.updateQuestion(id, {
      text,
      answers,
      type,
      configuration
    });
  }

  updateAnswer(answerId, { text, questions }) {
    const { answers, updateQuestion, type, configuration, id } = this.props;
    const newAnswers = answers.map(answer => {
      if (parseInt(answer.id) === parseInt(answerId)) {
        return { ...answer, text, questions };
      }

      return { ...answer };
    });

    const questionText = this.props.text;

    updateQuestion(id, {
      text: questionText,
      answers: newAnswers,
      type,
      configuration
    });
  }

  updateLogicalBranch(id, updates) {
    const { answers, updateQuestion, text, type, configuration } = this.props;
    const newAnswers = answers.map(answer => {
      if (answer.id === id) {
        return { ...answer, ...updates };
      }
      return { ...answer };
    });

    updateQuestion(id, { text, answers: newAnswers, type, configuration });
  }

  updateConfig(e, { name, value }) {
    let { configuration, updateQuestion, text, answers, type } = this.props;

    if (!configuration) {
      configuration = {};
    }

    updateQuestion(id, {
      text,
      answers,
      type,
      configuration: { ...configuration, ...{ name: value } }
    });
  }

  addAnswer() {
    const {
      answers,
      text,
      type,
      configuration,
      updateQuestion,
      id
    } = this.props;

    updateQuestion(id, {
      text,
      answers: [
        ...answers,
        { id: uniqueId(), text: "", type: { key: "ANSWER" }, questions: [] }
      ],
      type,
      configuration
    });
  }

  toggleModal() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  updateText({ text }) {
    const { asnwers, type, configuration, updateQuestion, id } = this.props;

    updateQuestion(id, {
      text,
      answers: [
        ...answers,
        { id: uniqueId(), text: "", type: { key: "ANSWER" }, questions: [] }
      ],
      type,
      configuration: { ...configuration, ...{ name: value } }
    });
  }

  deleteQuestion(event) {
    event.preventDefault();

    const { id } = this.props;

    if (this.props.onDelete) {
      this.props.onDelete(id);
    }
  }

  checkDuplicateAnswer(answerText) {
    const { answers } = this.props;
    return !answers.find(answer => answer.text === answerText);
  }

  render() {
    const { modalOpen, isConfigure } = this.state;

    const {
      text,
      id,
      answers,
      fixed,
      level,
      disabled,
      updateQuestion
    } = this.props;
    const rules = this.props.rules || [];
    const type = this.props.type || questionTypes[0];

    const count = answers.reduce(
      (accumulator, currentValue) => accumulator + currentValue.text.length + 3,
      text.length
    );

    let answersList = (
      <ul
        key={id}
        id={`answers-list-${id}`}
        className="questions-list reply-list"
      >
        {answers.map(answer => {
          if (answer.type.key === "ANSWER") {
            return (
              <Answer
                level={answer}
                updateAnswer={this.updateAnswer}
                validate={this.checkDuplicateAnswer}
                onDelete={this.onDeleteAnswer}
                key={answer.id}
                answer={answer}
                fixed={answer.fixed}
                type={type}
                rules={rules}
                questionId={id}
              />
            );
          }

          return (
            <LogicalBranch
              level={answer}
              updateAnswer={this.updateAnswer}
              updateLogicalBranch={this.updateLogicalBranch}
              validate={this.checkDuplicateAnswer}
              onDelete={this.onDeleteAnswer}
              key={answer.id}
              answer={answer}
              fixed={answer.fixed}
              questionId={id}
            />
          );
        })}
      </ul>
    );

    if (disabled) {
      answersList = (
        <ul id={`answers-list-${id}`} className="questions-list reply-list">
          {answers.map(answer => (
            <Answer
              disabled
              level={answer}
              updateAnswer={this.updateAnswer}
              validate={this.checkDuplicateAnswer}
              onDelete={this.onDeleteAnswer}
              key={answer.id}
              answer={answer}
              type={type}
              rules={rules}
            />
          ))}
        </ul>
      );
    }

    let actions = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content"
        }}
      >
        <CircularButton
          icon="settings"
          onClick={this.toggleConfig}
          small
          backgroundColor="#fff"
          color="#919191"
        />
        <CircularButton
          icon="delete"
          onClick={this.deleteQuestion}
          small
          backgroundColor="#fff"
          color="#919191"
        />
      </div>
    );

    if (disabled) {
      actions = null;
    }

    return (
      <li data-question-id={id}>
        <div className="question-main-level">
          <div
            className="question-box"
            style={{
              border: "solid 2px #d9d9d9",
              boxShadow: "none",
              width: "max-content"
            }}
          >
            <div
              className="question-head reorder"
              style={{
                position: "relative",
                backgroundColor: "#f3f3f3",
                borderBottom: "solid 2px #d9d9d9",
                color: "#3d4554",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                minWidth: "max-content"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                {level}:
                {!fixed ? (
                  <MwambaDropDownSelectDescriptive
                    options={transformedQuestionTypes}
                    value={type.key}
                    onChange={this.onQuestionTypeChange}
                    onAddQuestionGroup={this.props.onAddQuestionGroup}
                    questionId={id}
                    placeholder="Select a question type"
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      backgroundColor: "transparent",
                      margin: "-10px 10px 0px 0px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        flexDirection: "column",
                        padding: 10
                      }}
                    >
                      <span style={{ fontWeight: "bold", color: "#6d6e71" }}>
                        {type.title}
                      </span>
                      <span style={{ color: "#6d6e71" }}>
                        {type.description}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center"
                }}
              >
                {!fixed ? actions : null}
                {!fixed &&
                type &&
                type.key.search("MULTIPLE_CHOICE") === 0 &&
                !disabled ? (
                  <CircularButton
                    icon="add"
                    onClick={this.addAnswer}
                    small
                    backgroundColor="#fff"
                    color="#919191"
                  />
                ) : null}
                {count > 140 ? (
                  <div
                    style={{
                      backgroundColor: count < 161 ? "#80c582" : "#f0ca4d",
                      borderRadius: 10,
                      color: "#fff",
                      height: 25,
                      margin: "0px -8px 0px 10px",
                      padding: "0px 5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {count}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="question-content" style={{ position: "relative" }}>
              {/*
              <RIETextArea isDisabled={disabled || false} ref={(ref) => { this.ref = ref; }} rows="3" value={text} propName="text" className="question-editable" classEditing="riek-editing" change={this.updateText} />
              */}
              <Textarea
                value={text}
                name="text"
                onChange={this.onTextChange}
                style={{
                  border: "none",
                  borderRadius: 0,
                  padding: 15,
                  margin: 0,
                  backgroundColor: !this.props.isCommenting
                    ? "#fff"
                    : "#fafafa",
                  overflow: "hidden",
                  resize: "none",
                  minHeight: 60,
                  width: "calc(100% - 10px)",
                  color: "#6d6e71"
                }}
                placeholder="Type your text here"
                rows={1}
              ></Textarea>
            </div>
            {isConfigure ? (
              <div>
                <ValidationRules
                  rules={rules}
                  updateValidationRules={this.onUpdateValidationRules}
                />
                <Form.Group className="configure">
                  <Header as="h5" content="Question Configuration" dividing />
                  <Input
                    disabled={disabled || false}
                    onChange={this.updateConfig}
                    name="downloadText"
                    width={8}
                    label="Short Name"
                    size="small"
                    placeholder="Short Names are important in reporting"
                  />
                </Form.Group>
              </div>
            ) : null}
          </div>
        </div>
        {answersList}
        <Modal size="small" open={modalOpen} onClose={this.toggleModal}>
          <Modal.Header>Delete Question?</Modal.Header>
          <Modal.Content style={{ width: "80%" }}>
            <p>Would you like to delete this question and all its contents?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button positive onClick={this.toggleModal}>
              No
            </Button>
            <Button negative content="Yes" onClick={this.deleteQuestion} />
          </Modal.Actions>
        </Modal>
      </li>
    );
  }
}

export default Question;
