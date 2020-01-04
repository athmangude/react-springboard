import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import AceEditor from "react-ace";

import jsonlint from 'Utils/jsonlint';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-terminal";

import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import Preview from '../Preview';
import SnackbarDialog from 'SharedComponents/snackbar-dialog';

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
    }

    onCloseSnackbar = () => {
        this.setState({
            isSnackbarDialogOpen: false,
            snackbarDialogTitle: null,
            snackbarDialogMessage: null,
        })
    }

    render() {
        const { editorValue, committedEditorValue, isSnackbarDialogOpen, snackbarDialogMessage, snackbarDialogVariant, snackbarDialogTitle, adornment } = this.state;

        return (
            <SimpleLayoutExtended>
                <NewQuestionnaireWrapper>
                    <div className="editor-container">
                        <AceEditor
                            mode="json"
                            theme="terminal"
                            onChange={this.onChange}
                            name="EDITOR"
                            className="editor"
                            enableBasicAutocompletion
                            enableLiveAutocompletion
                            showGutter
                            value={editorValue}
                            editorProps={{ $blockScrolling: true }}
                        />
                        <div className="editor-controls">
                            <Button className="button" variant="outlined" color="primary" onClick={this.onValidate}>Validate</Button>
                            <Button className="button" variant="outlined" color="primary" onClick={this.onValidateAndPreview}>Validate&nbsp;and&nbsp;Preview</Button>
                        </div>
                    </div>
                    <div className="preview">
                        <Preview committedEditorValue={committedEditorValue} currentEditorValue={editorValue} />
                    </div>
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
            </SimpleLayoutExtended>
        );
    }
}