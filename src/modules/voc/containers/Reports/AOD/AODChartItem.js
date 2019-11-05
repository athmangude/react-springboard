import React from 'react';
import { Icon, Header, Form, Checkbox, Label, Modal, Button, Card, Image, Comment, Statistic } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { observer } from 'mobx-react';
import Case from "case";
import BarChart from '../../../legacy/common/charts/BarChart';

import { questionTypes } from '../../conversations/components/questions/questiontypes.json';

import ReactPlaceholder from 'react-placeholder';

import { Scrollbars } from 'react-custom-scrollbars';

import user from "../../../legacy/common/resources/user.svg";

import './AODChartItem.css';

class AODChartItem extends React.Component {
  state = {
    width: 300
  }
  componentDidMount() {
    this.setState({ width: this.node.offsetWidth - 20 })
  }

  render() {
    const { chartData, question } = this.props;
    const { width } = this.state;
    const questionType = questionTypes.find((q) => q.key === question.type);
    let chart = (<BarChart width={width} {...chartData} />);

    if (questionType.key == 'OPEN_ENDED' || questionType.key == 'OPEN_ENDED_NPS'){
      chart = (
          <Scrollbars style={{ width: '100%', height: 250 }} autoHide>
            {
              chartData.data.map((response) => {
                return (
                  <div style={{display:'flex', backgroundColor: '#fafafa', border: 'solid 0.01em #d9d9d9', marginBottom: '.7em', padding:'0 0.3em'}}>
                    <img style={{width: '2em'}} width={30} src={user} />
                        <span style={{marginTop: '.8em', marginLeft: '.5em'}}>{ response[chartData['y']]  }</span>
                  </div>

                )
              })
            }
          </Scrollbars>
        );
    };


    return (
      <Card className="aod-chart-item">
      <Card.Content>
        <Card.Header>
          <i className="material-icons ">chat</i>
          <div className="title">{question.text}</div>
          <Icon className="action" name="ellipsis horizontal" />
        </Card.Header>
        <Card.Meta>
          { questionType.title }
        </Card.Meta>
        <Card.Description>
          <div ref={node => {this.node = node}}/>
          { chart }
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" /> <span><b>Responses:</b> {chartData.data.length}</span>

      </Card.Content>
    </Card>

    )
  }
}

export default AODChartItem;
