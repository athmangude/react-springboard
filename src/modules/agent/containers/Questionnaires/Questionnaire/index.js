import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import AceEditor from "react-ace";

import jsonlint from 'Utils/jsonlint';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-terminal";

import QuestionnaireLayout from 'Layouts/questionnaire-layout';
import Presentation from 'SharedComponents/questionnaire-elements/Presentation';
import Section from 'SharedComponents/questionnaire-elements/Section';
import SnackbarDialog from 'SharedComponents/snackbar-dialog';
import BottomPanel from './BottomPanel';

import styles from './index.css';

import exampleQuestionnaire from './example.json';

const NewQuestionnaireWrapper = styled.div`${styles}`;

export default class NewQuestionnaire extends Component {
  constructor(props) {
    super(props);

    const formattedEditorValue = JSON.stringify(exampleQuestionnaire, null, '\t');
    this.state = {
      editorValue: formattedEditorValue,
      committedEditorValue: formattedEditorValue,
      isSnackbarDialogOpen: false,
      snackbarDialogMessage: '',
      snackbarDialogVariant: 'info',
      snackbarDialogTitle: '',
      adornment: null,
      responses: {},
      activeSection: 0,
    }
  }

  onChange = (editorValue) => {
    this.setState({ editorValue });
  }

  onValidate = () => {
    const { editorValue } = this.state;
    try {
      jsonlint().parse(editorValue);

      this.setState({
        isSnackbarDialogOpen: true,
        snackbarDialogTitle: 'Valid JSON',
        snackbarDialogMessage: 'The JSON in the editor has passed syntactic correctness checks and verified to be valid.',
        snackbarDialogVariant: 'success',
        adornment: null,
      });

      return true;

    } catch (exception) {
      this.setState({
        isSnackbarDialogOpen: true,
        snackbarDialogTitle: 'Invalid JSON',
        snackbarDialogMessage: 'The JSON in the editor has NOT passed syntactic correctness checks.',
        snackbarDialogVariant: 'error',
        adornment: exception.message,
      });

      return false;
    }
  }

  onValidateAndPreview = () => {
    const onValidateResult = this.onValidate();

    if (onValidateResult) {
      const { editorValue } = this.state;
      this.setState({ committedEditorValue: editorValue });
    }
  }

  onCloseSnackbar = () => {
    this.setState({
      isSnackbarDialogOpen: false,
      snackbarDialogTitle: null,
      snackbarDialogMessage: null,
    })
  }

  onGoBack = () => {
    const { activeSection } = this.state;
    this.setState({ activeSection: activeSection - 1 });
  }

  onChange = (tag, response) => {
    const { responses } = this.state;
    this.setState({ responses: { ...responses, [tag]: response } });
  }

  onNext = () => {
    const { activeSection } = this.state;
    this.setState({ activeSection: activeSection + 1 });
  }

  render() {
    const { editorValue, committedEditorValue, isSnackbarDialogOpen, snackbarDialogMessage, snackbarDialogVariant, snackbarDialogTitle, adornment, activeSection, responses } = this.state;
    const questionnaire = JSON.parse(committedEditorValue);
    const section = questionnaire.sections[activeSection];

    return (
      <QuestionnaireLayout bottomPanelComponent={(
        <BottomPanel onGoBack={this.onGoBack} canGoBack={activeSection > 0} />
      )}>
        <NewQuestionnaireWrapper>
          <Section
            key={section.tag}
            questions={section.questions}
            responses={responses}
            onChange={this.onChange}
            title={section.title}
            tag={section.tag}
            type={section.type}
            messages={section.messages}
            media={section.media}
            onNext={this.onNext}
            isLastSection={activeSection + 1 === questionnaire.sections.length}
          />
        </NewQuestionnaireWrapper>
        {/* <Snackbar message="Lorem ipsum dolor sit amet" variant="info" /> */}
        <SnackbarDialog
          message={snackbarDialogMessage}
          variant={snackbarDialogVariant}
          onClose={this.onCloseSnackbar}
          title={snackbarDialogTitle}
          open={isSnackbarDialogOpen}
          adornment={adornment}
        />
      </QuestionnaireLayout>
    );
  }
}