/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary */
import React, { Component } from 'react';
import moment from 'moment';
import DateRangePicker from 'SharedComponents/date-range-picker';
import IconButton from 'SharedComponents/icon-button';
import ActivityContent from '../Activity/content';
import ActionBar from '../../../components/ActionBar';

const TransactionHistory = ({ onCloseSidePanel, participant, participantId, customerAnalyticsActions, EventHandler, demoMode, selectedActivity, isLoadingTransactions, selectedDateRange, onChangeDateRange, themes, currency, windowDimensions, activityInformation, width, context }) => (
  <div style={{ width: '100%', backgroundColor: '#fff' }}>
    <div style={{ width: '100%', height: 63, backgroundColor: '#F4F4F5', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', zIndex: 5 }}>
      <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{`${participant.firstName} ${participant.lastName}`}</h2>
      <IconButton icon="close" onClick={onCloseSidePanel} />
    </div>
    <div style={{ width: '100%', position: 'sticky', top: 63, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 7px -2px rgba(0, 0, 0, 0.6)', zIndex: 5, padding: '10px 0 10px 0' }}>
      <ActionBar
        windowDimensions={windowDimensions}
        actions={
          [
            {
              items: [
                { key: 1, label: 'Today', value: { from: moment().startOf('day').format(), to: moment().endOf('day').format(), label: 'Today' } },
                { key: 2, label: 'Last 7 Days', value: { from: moment().subtract(7, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 7 Days' } },
                { key: 3, label: 'Last 30 Days', value: { from: moment().subtract(30, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 30 Days' } },
                { key: 4, label: 'Last 60 Days', value: { from: moment().subtract(60, 'days').startOf('day').format(), to: moment().endOf('day').format(), label: 'Last 60 Days' } },
                { key: 5, label: 'Custom Range', dialogTrigger: true, value: {} },
              ],
              active: selectedDateRange,
              callBack: onChangeDateRange,
              dialogComponent: <DateRangePicker range={selectedDateRange} />,
            },
          ]
        }
      />
    </div>
    <ActivityContent
      isLoadingTransactions={isLoadingTransactions}
      selectedActivity={selectedActivity}
      currency={currency}
      customerAnalyticsActions={customerAnalyticsActions}
      selectedDateRange={selectedDateRange}
      participantId={participantId}
      EventHandler={EventHandler}
      demoMode={demoMode}
      themes={themes}
      activityInformation={activityInformation}
      width={width}
      context={context}
      style={{ width: '100%', flex: 1}}
    />
  </div>
);

export default TransactionHistory;

