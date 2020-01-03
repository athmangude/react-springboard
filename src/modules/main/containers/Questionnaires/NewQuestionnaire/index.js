import React, { Component } from 'react';
import styled from 'styled-components';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import Preview from '../Preview';

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
        }
    }

    onChange = (editorValue) => {
        this.setState({ editorValue });
    }

    render() {
        const { editorValue, committedEditorValue } = this.state;

        return (
            <SimpleLayoutExtended>
                <NewQuestionnaireWrapper>
                    <div className="editor-container">
                        <AceEditor
                            mode="json"
                            theme="github"
                            onChange={this.onChange}
                            name="EDITOR"
                            className="editor"
                            value={editorValue}
                            editorProps={{ $blockScrolling: true }}
                        />
                    </div>
                    <div className="preview">
                        <Preview committedEditorValue={committedEditorValue} currentEditorValue={editorValue} />
                    </div>
                </NewQuestionnaireWrapper>
            </SimpleLayoutExtended>
        );
    }
}