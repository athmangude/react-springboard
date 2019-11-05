import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Loader } from 'semantic-ui-react';

import ActionButton from 'SharedComponents/action-button';

const AccountWebhookEvents = ({ tab, formattedWebhookEventTypes, webhookEvents, onAddWebhookClicked, onCancelClicked, onCreateClicked, onRemoveWebhookClicked, createWebhookEvents, isUpdatingWebhookEvent, webhookIdBeingUpdated, onChangeWebhook, onEditWebhook, saveWebhookEventSettings, updateWebhookEvent, deleteWebhookEvent, isDeletingWebhookEvent, isSavingWebhookEvent, webhookIdBeingDeleted, webhookEventTypeIdBeingSaved }) => (
  <div style={{ width: '100%' }}>
    {tab === 'Account' ? formattedWebhookEventTypes.filter((type) => type.level === 'ACCOUNT').map((webhookEventType) => (
      <div style={{ width: '100%', margin: 0, padding: 16, marginTop: -1, listStyleType: 'none', borderTop: '1px solid #e1e4e8' }}>
        <h4 style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          {webhookEvents.accountHookViewList.find((hook) => hook.surveyHookConfigId === webhookEventType.id && hook.status === 'ACTIVE') ? (
            <i className="material-icons" style={{ marginRight: 5 }}>check</i>
          ) : null}
          &nbsp;{webhookEventType.title}
        </h4>
        <p style={{ minHeight: 17, margin: '4px 0 2px', fontSize: 14, color: '#586069' }}>{webhookEventType.description}</p>
        {webhookEvents.accountHookViewList.find((hook) => hook.surveyHookConfigId === webhookEventType.id && hook.status === 'ACTIVE') ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {webhookEvents.accountHookViewList.filter((event) => event.surveyHookConfigId === webhookEventType.id && event.mode === 'API' && event.status === 'ACTIVE').map((event) => (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'fcenter' }}>
                <Input key={event.accountHookId} id={event.accountHookId} onChange={onEditWebhook} defaultValue={event.eventDetails} fluid placeholder="Web hook" style={{ height: 30, marginBottom: 10, width: '100%' }} />
                <div style={{ width: 200, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {isUpdatingWebhookEvent && webhookIdBeingUpdated === event.accountHookId ? (
                      <Loader active inline size="tiny" style={{ marginLeft: 10 }} />
                    ) : null}
                    <ActionButton icon="edit" text="Edit" onClick={() => updateWebhookEvent(event)} />
                  </div>
                  <div>
                    {isDeletingWebhookEvent && webhookIdBeingDeleted === event.accountHookId ? (
                      <Loader active inline size="tiny" style={{ marginLeft: 10 }} />
                    ) : null}
                    <ActionButton icon="delete" text="Remove" onClick={() => deleteWebhookEvent(event)} style={{ color: '#f26b50' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {createWebhookEvents[webhookEventType.id] ? (
              <ActionButton icon="close" text="Cancel" onClick={() => onCancelClicked(webhookEventType.id)} />
            ) : (
              <ActionButton icon="add" text="Create" onClick={() => onCreateClicked(webhookEventType.id)} />
            )}
            {createWebhookEvents[webhookEventType.id] ? createWebhookEvents[webhookEventType.id].map((hook) => (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'fcenter' }}>
                <Input error={!createWebhookEvents[webhookEventType.id].find((event) => event.id === hook.id).valid} key={hook.id} value={hook.value} id={`${webhookEventType.id}-${hook.id}`} onChange={onChangeWebhook} fluid placeholder="Web hook" style={{ height: 30, marginBottom: 10, width: '100%' }} />
                <div style={{ width: 200, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <ActionButton icon="delete" text="Remove" onClick={() => onRemoveWebhookClicked(webhookEventType.id, hook.id)} style={{ color: '#f26b50' }} />
                </div>
              </div>
            )) : null}
            {createWebhookEvents[webhookEventType.id] ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <ActionButton icon="add" text="Add" onClick={() => onAddWebhookClicked(webhookEventType.id)} />
                <Button type="submit" disabled={(isSavingWebhookEvent && parseInt(webhookEventTypeIdBeingSaved, 10) === webhookEventType.id) || createWebhookEvents[webhookEventType.id].find((type) => !type.valid)} loading={isSavingWebhookEvent && parseInt(webhookEventTypeIdBeingSaved, 10) === webhookEventType.id} onClick={() => saveWebhookEventSettings(webhookEventType.id)} style={{ height: 35, borderRadius: 17.5, backgroundColor: '#002366', margin: '10px 10px', width: 133 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -5 }}>
                    <i className="material-icons" style={{ color: '#FFF', marginRight: 10 }}>save</i>
                    <span style={{ color: '#FFF', fontSize: 12 }}>Save</span>
                  </div>
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    )) : null}
  </div>
);

AccountWebhookEvents.propTypes = {
  tab: PropTypes.string,
  formattedWebhookEventTypes: PropTypes.array,
  webhookEvents: PropTypes.object,
  onAddWebhookClicked: PropTypes.func,
  onCancelClicked: PropTypes.func,
  onCreateClicked: PropTypes.func,
  onRemoveWebhookClicked: PropTypes.func,
  createWebhookEvents: PropTypes.func,
  isUpdatingWebhookEvent: PropTypes.bool,
  webhookIdBeingUpdated: PropTypes.string,
  onChangeWebhook: PropTypes.func,
  onEditWebhook: PropTypes.func,
  saveWebhookEventSettings: PropTypes.func,
  updateWebhookEvent: PropTypes.func,
  deleteWebhookEvent: PropTypes.func,
  isDeletingWebhookEvent: PropTypes.bool,
  isSavingWebhookEvent: PropTypes.bool,
  webhookIdBeingDeleted: PropTypes.string,
  webhookEventTypeIdBeingSaved: PropTypes.string,
};

export default AccountWebhookEvents;
