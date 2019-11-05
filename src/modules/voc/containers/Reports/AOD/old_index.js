import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Menu, Popup, Button, Grid, Card, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import  _ from "lodash";
import { Link } from 'react-router-dom';
import autobind from 'autobind-decorator';
import SurveyTitle from './SurveyTitle';
import Filters from './Filters';
import AODChartItem from './AODChartItem';
import Placeholders from '../../../legacy/common/lists/Placeholders';
import DocumentTitle from 'react-document-title';

import withAuthentication from 'Utils/withAuthentication';
import DefaultLayout from 'Layouts/default';

import * as aodReportActions from './flux/actions';
import * as aodReportMethods from './flux/methods';

@connect((state) => ({
  aodReport: state.aodReport,
}),
(dispatch) => ({
  aodReportActions: bindActionCreators(aodReportActions, dispatch),
}))
@observer
class AODReport extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.fetchAODData = this.fetchAODData.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.renderTop = this.renderTop.bind(this);
  }

  state = {
    responses: [],
    questions: [],
    metadata: [],
    isFetchingData: false,
  }

  componentWillMount() {
    this.fetchAODData();
  }

  componentDidMount() {
    // this.fetchAODData();
    // const { store, match } = this.props;
    // const { state } = this.props.location;
    // store.fetchData(match.params['id']);
    // this.handler = autorun(() => {
    //   const {responses, questions, metadata, surveyConfig} = store;
    //   if(questions){
    //     this.afterFetch({
    //       responses,
    //       questions,
    //       metadata,
    //       surveyConfig
    //     })
    //   };
    // });
  }

  componentWillUnmount() {
    // this.handler();
  }

  async fetchAODData() {
    this.setState({
      isFetchingData: true,
    });

    const surveyId = this.context.router.route.match.params.id;

    try {
      const fetchAODDataResult = await aodReportMethods.fetchAODData(surveyId);
      this.props.aodReportActions.setAODData(surveyId, fetchAODDataResult.data.data);
    } catch (exception) {
      console.log(exception);
    } finally {
      this.setState({
        isFetchingData: false,
      });
    }
  }

  // @autobind
  // afterFetch(body){
  //   let {responses, questions, metadata, surveyConfig} = body;
  //   this.setState({
  //     responses, questions, metadata, surveyConfig
  //   })
  // }

  @autobind
  formatQuestionForChart(question) {
    const { responses } = this.state;
    const qResponses = responses.filter(({ questionId })=>questionId == question.id);
    switch (question.type) {
      case "MULTIPLE_CHOICE":
      case "MULTIPLE_CHOICE_SINGLE_SELECT":
      case "OPEN_ENDED_NPS":
      case "OPEN_ENDED":
        return {
          y: "text",
          x: "occurances",
          data: Object.entries(qResponses.reduce((a,b) => (a[b.text] = a[b.text] + 1 || 1) && a, {})).map((arr)=>{ return { text: arr[0], occurances: arr[1]}})
        }
        break;
        case "OPEN_ENDED_INTEGER":
        case "OPEN_ENDED_RANGE_0_10":
          return {
            y: "text",
            x: "occurances",
            data: Object.entries(qResponses.reduce((a,b) => (a[b.text] = a[b.text] + 1 || 1) && a, {})).map((arr)=>{ return { text: arr[0], occurances: arr[1]}})
          }
        case "OPEN_ENDED_NPS_0_10":
        const categories = _.groupBy(qResponses, (item)=>{
            const count = parseInt(item.text);
            if(count<=6)
              return "detractors";
            if(count<=8)
              return "passives";
            return "promoters"
          });
          return {
            y: "title",
            x: "count",
            data: [
              { title: "Detractors" , count: categories['detractors']?categories['detractors'].length:0 },
              { title: "Passives" , count: categories['passives']?categories['passives'].length:0 },
              { title: "Promoters" , count: categories['promoters']?categories['promoters'].length:0 },
            ]
          }
      default:
        return {
          y: "text",
          x: "occurances",
          data: []
        }
    }
  }

  renderCards() {
    const surveyId = this.context.router.route.match.params.id;

    if (Object.keys(this.props.aodReport).includes(surveyId)) {
      const surveyConfig = this.props.aodReport[surveyId].surveyConfig[0];
      const pc = surveyConfig && surveyConfig.maxRespondents?parseInt(surveyConfig.completed*100/surveyConfig.maxRespondents):0;
      const { activeItem, questions, responses, metadata } = this.props.aodReport[surveyId];
      const charts = questions.sort((a, b) => a.id > b.id);

      return (
        <Card.Group itemsPerRow={2}>
          {
            charts.map((question) => {
              const chartData = this.formatQuestionForChart(question);
              return <AODChartItem chartData={{ ...chartData }} question={question} />
            })
          }
        </Card.Group>
      );
    }

    if (this.state.isFetchingData) {
      return (
        <Placeholders items={2} />
      )
    }

    return (
      <div>Cards should come here</div>
    );
  }

  renderTop() {
    const surveyId = this.context.router.route.match.params.id;
    if (Object.keys(this.props.aodReport).includes(surveyId)) {
      const surveyConfig = this.props.aodReport[surveyId].surveyConfig[0];
      const pc = surveyConfig && surveyConfig.maxRespondents?parseInt(surveyConfig.completed*100/surveyConfig.maxRespondents):0;
      const { activeItem, questions, responses, metadata } = this.props.aodReport[surveyId];
      const charts = !this.state.isFetchingData ? questions.sort((a,b)=>a.id>b.id):Array(4).fill({}); //fill empty

      return (
        <div className="name-box">
          <span>
            {surveyConfig.title}
          </span>
          <div className="extras">
            <span className="survey-progress">
              <span className="survey-progress-bg">
                <span
                  className="survey-progress-fg"
                  style={{width: `${pc}%`}} />
              </span>
              <span className="survey-progress-labels">
                <span className="survey-progress-label">
                  { pc }%
                </span>
                <span className="survey-completes">
                  { surveyConfig.completed } / { surveyConfig.maxRespondents} Completions
                </span>
              </span>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="name-box"></div>
    );
  }

  render() {
    return (
      <DefaultLayout>
        <section className="content">
          <div className="top">
            {this.renderTop()}
            <div className="options" id="options">
              <Label.Group className="actions">
                <Label style={{ marginRight: '3em' }} as={Link} to="/conversations/new">New Conversation</Label>
                <Label to="/conversations" color={'grey'} as={Link}>Active</Label>
                <Label to="/conversations/drafts" as={Link}>Drafts</Label>
                <Label to="/conversations/closed" as={Link}>Closed</Label>
              </Label.Group>
            </div>
          </div>
          <Grid style={{ flexWrap: 'nowrap', marginTop: '1em'}} className="ui-container">
           <Grid.Column width={11}>
              <div className="list">
                {this.renderCards()}
              </div>
            </Grid.Column>
            <Grid.Column width={5}>
              <Filters active={['age', 'dateRange']} />
            </Grid.Column>
          </Grid>
        </section>
      </DefaultLayout>
    );
  }
}

export default withAuthentication(AODReport);
