/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollArea from 'react-scrollbar';
import { Tab } from 'semantic-ui-react';
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

    Object.values(this.props.question.responses).forEach((response) => {
      const responseWords = response.replace(/[^\w\s]/gi, '').toLowerCase().split(' ');
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
                  verticalContainerStyle={{ width: 5, borderRadius: '2.5px', marginLeft: 10 }}
                  style={{ width: '100%', minHeight: question.responses.length > 3 ? 200 : 30 * question.responses.length, maxHeight: 200, paddingRight: 20 }}
                >
                  {
                    Object.entries(question.responses).map((response, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', margin: '5px 5px', backgroundColor: '#FFF', border: 'solid 1px #d9d9d9', padding: '0px 10px', minHeight: 60, maxHeight: 100, borderRadius: 30 }}>
                        <div style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: '#ffac28', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="material-icons" style={{ color: '#FFF', fontSize: 23 }}>person_outline</i>
                        </div>
                        <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', width: 'calc(100% - 30px)' }}><small>{response[1]}</small></div>
                        {/*
                        <div style={{ width: 20, display: 'flex', alignItems: 'center' }}>
                          <i className="material-icons" style={{ color: '#808285', fontSize: 20 }}>info</i>
                        </div>
                        */}
                      </div>
                    ))
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
          //         style={{ width: '100%', minHeight: this.state.wordCloud.length > 30 ? 200 : 10 * (this.state.wordCloud.length / 3), maxHeight: 200, paddingRight: 20 }}
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
