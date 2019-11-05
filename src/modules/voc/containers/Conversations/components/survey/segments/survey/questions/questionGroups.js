import uniqueId from 'lodash/uniqueId';
import questionTypes from './questiontypes';

export default [
  {
    id: 99,
    title: 'NPS Section',
    description: 'A set of questions for NPS',
    key: 'QUESTION_GROUP_NPS',
    shortCode: 'NPS',
    color: 'blue',
    control: 'NPS_GROUP',
    body: {
      id: uniqueId(),
      // level: '2',
      text: 'On a scale of 0 to 10 (0-Less Likely, 10-Very Likely), how likely are you to recommend to your friends/family?',
      answers: [
        {
          id: uniqueId(),
          // level: '2.1',
          questions: [
            {
              id: uniqueId(),
              // level: '2.1.1',
              text: 'What did you not like about today?',
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
          // level: '2.2',
          questions: [
            {
              id: uniqueId(),
              // level: '2.2.1',
              text: 'What can improve on that will delight you next time?',
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
          // level: '2.3',
          questions: [
            {
              id: uniqueId(),
              // level: '2.3.1',
              text: 'What impressed you about today?',
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
  },
];
