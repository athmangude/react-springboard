/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollArea from 'react-scrollbar';
import { Tab } from 'semantic-ui-react';

import Comment from './Comment';
import './CommentList.css';

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.calculateWordFrequency = this.calculateWordFrequency.bind(this);
  }

  state = {
    wordCloud: [],
  };

  componentDidMount() {
    this.calculateWordFrequency();
  }

  calculateWordFrequency() {
    const wordMap = {};

    Object.values(this.props.question.analysis).forEach((response) => {
      const responseWords = response.text ? response.text.replace(/[^\w\s]/gi, '').toLowerCase().split(' ') : [];
      responseWords.forEach((word) => {
        Object.keys(wordMap).includes(word.toString()) ? wordMap[word.toString()] += 1 : wordMap[word.toString()] = 1; // eslint-disable-line no-unused-expressions
      });
    });

    const wordCloud = Object.keys(wordMap).map((key) => ({ word: key, frequency: wordMap[key] })).sort((a, b) => b.frequency - a.frequency);

    this.setState({ wordCloud });
  }

  render() {
    const { question } = this.props;
    
    return (
      <div style={{ width: '100%', margin: 0 }}>
        <Tab
          menu={{ attached: 'top', secondary: true, pointing: true, tabular: true }}
          style={{ borderRadius: 0 }}
          panes={[{
            menuItem: 'Comments',
            render: () => (
              <div style={{ width: '100%', padding: 0, overflow: 'hidden' }}>
                <ScrollArea
                  horizontal={false}
                  verticalContainerStyle={{ width: 5, backgroundColor: '#d9d9d9' }}
                  style={{ width: '100%', minHeight: question.analysis.length > 3 ? 200 : 30 * question.analysis.length, maxHeight: 200, paddingRight: 10 }}
                >
                  {
                    question.responses.map((response, i) => {
                      if (!response.response) {
                        return null;
                      }
                      return (<Comment key={i} response={response} i={i} checkQuestionType={question.questionType} />);
                    })
                  }
                </ScrollArea>
              </div>
            ),
          },
          // {
          //   menuItem: 'Word Frequency',
          //   render: () => (
          //     <div style={{ width: '100%', padding: 0, overflow: 'hidden' }}>
          //       <ScrollArea
          //         horizontal={false}
          //         verticalContainerStyle={{ width: 5, borderRadius: '2.5px', marginLeft: 10 }}
          //         style={{ width: '100%', minHeight: question.analysis.length > 3 ? 200 : 30 * question.analysis.length, maxHeight: 200, paddingRight: 20 }}
          //       >
          //         {
          //           this.state.wordCloud.map((item, i) => (
          //             <div key={i} style={{ display: 'flex', flexDirection: 'row', padding: '3px 10px', backgroundColor: item.resolved ? '#20ab9c' : '#808285', color: '#FFF', margin: 3, borderRadius: 20 }}>
          //               <span>({item.frequency})</span>&nbsp;
          //               <div>{item.word}</div>&nbsp;
          //             </div>
          //           ))
          //         }
          //       </ScrollArea>
          //     </div>
          //   ),
          // }
        ]}
        />
      </div>
    );
  }
}

CommentList.propTypes = {
  question: PropTypes.object.isRequired,
};

export default CommentList;
