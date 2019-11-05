/* eslint-disable object-curly-newline */
import React from 'react';
import numeral from 'numeral';
import moment from 'moment';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';

import Title from 'Modules/analytics/containers/components/Title';

const TransactionInformation = (props) => (
  (props.loading) ? (
    <div style={{ flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: '100%', padding: 10, backgroundColor: 'rgb(236, 236, 236)', alignItems: 'center', justifyContent: 'space-between' }}>
          <ReactPlaceholder
            showLoadingAnimation
            customPlaceholder={(
              <div style={{ width: '100%', marginBottom: 5 }}>
                <RectShape color="#fff" style={{ height: 20, marginBottom: 5, width: 100 }} />
                <RectShape color="#fff" style={{ height: 20, width: 200 }} />
              </div>
            )}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 70 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 150 }} /></div>} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 70 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 150 }} /></div>} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 70 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 150 }} /></div>} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 70 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 150 }} /></div>} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 70 }} /></div>} />
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 20, width: 150 }} /></div>} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: '100%', padding: 10, backgroundColor: 'rgb(236, 236, 236)', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title title="Details" subtitle="What are the particulars of their transaction?" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Date</div>
            <div>{moment(props.selectedActivity.transactionDate).format('DD MMM YYYY')}</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Amount</div>
            <div>
              {props.currency}
              {' '}
              {numeral(props.selectedActivity.amountSpent).format('0,0')}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Location</div>
            <div>{props.selectedActivity.location}</div>
          </div>
          {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Paid via</div>
            <div>M-PESA</div>
          </div> */}
          {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', backgroundColor: 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Reference number</div>
            <div>17236176376761</div>
          </div> */}
        </div>
      </div>
    </div>
  )
);

export default TransactionInformation;