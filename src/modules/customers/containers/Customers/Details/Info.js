import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import moment from 'moment';
import styled from 'styled-components';

import InfoCard from 'Utils/info-card';
import infoCardStyles from 'Utils/info-card/infoCardStyles';

const InfoCardWrapper = styled.div`${infoCardStyles}`;

function randomDate(start, end) {
  const random = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return `${[random.getFullYear(), random.getMonth() + 1, random.getDate()].join('-')} ${[random.getHours(), random.getMinutes(), random.getSeconds()].join(':')}`;
}

const fakedSummary = {
  'Last Touchpoint Engaged': ['ATM', 'Branch',  'Agency Banking', 'KCB M-PESA', 'ECRM', 'Insurance', 'Advantage', 'Mortgage', 'Other'],
  'Number of Branch visits': [6],
  'Account Type':	['Savings', 'Current'], 
  'Account Status':	['Active', 'Dormant'],
  'Internet Banking':	['Yes', 'No'],
  'CRB Status':	['Listed', 'Unlisted'],
  'NPS Segment':	['Promoter', 'Passive', 'Detractor'],
  'Customer Effort':	['Least', 'Little', 'Neutral', 'Some', 'A Lot'],
  'Signed up date': [moment(randomDate(new Date(2015, 0, 1), new Date(2017, 0, 1))).format('LLL')],	
};

const Info = (props) => {
  console.log(props);

  return (
    <Container fluid style={{ margin: 0, padding: 0 }}>
      <Row style={{ padding: 10 }} style={{ margin: 0, padding: 0 }}>
        <Col xl={6} lg={6} md={12} sm={12} xs={12} style={{ margin: 0, padding: 0 }}>
          <InfoCard title="Customer Details" data={props.customer} schema={props.detailsSchema} />
        </Col>
        <Col xl={6} lg={6} md={12} sm={12} xs={12} style={{ margin: 0, padding: 0 }}>
          {/* <InfoCard title="Customer Summary" data={props.customer} schema={props.summarySchema} /> */}
          <InfoCardWrapper>
            <div className="title">Customer Summary</div>
            <div className="content">
              {
                Object.keys(fakedSummary).map((summary) => {
                  const options = fakedSummary[summary];
                  const value = options[Math.floor(Math.random() * options.length)];
                  return (
                    <div className="item">
                      <span style={{ fontWeight: 'bold', fontSize: 12 }}>{summary}</span>
                      <span style={{ textTransform: 'capitalize' }}>{value}</span>
                    </div>
                  );
                })
              }
            </div>
          </InfoCardWrapper>
        </Col>
        {/* <Col xl={6} lg={6} md={12} sm={12} xs={12} style={{ margin: 0, padding: 0 }}>
          <InfoCard title="Customer Attributes" data={props.customer} schema={props.attributesSchema} />
        </Col> */}
      </Row>
    </Container>
  );
};

export default Info;
