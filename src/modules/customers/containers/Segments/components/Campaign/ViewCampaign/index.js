import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ErrorState from 'SharedComponents/mwamba-error-state';
import WideConversationListItem from 'Modules/voc/containers/Conversations/components/WideConversationListItem';
import PaginationNext from 'SharedComponents/pagination-next';
import themes from 'SharedComponents/themes';

const { primaryColor } = themes.light;

export default class ViewCampaign extends Component {
    static propTypes = {
      segmentId: PropTypes.number,
      conversationActions: PropTypes.object,
      EventHandler: PropTypes.object,
      demoMode: PropTypes.object,
    };
  
    constructor(props) {
      super(props);
  
      this.state = {
        isLoadingConversations: false,
        type: 'active',
        conversations: {
            items: [],
            totalCount: null
        },
        perPage: 10,
      };
  
      this.onPaginationNextPageChange = this.onPaginationNextPageChange.bind(this);
      this.fetchConversations = this.fetchConversations.bind(this);
    }

    componentDidMount() {
        this.fetchConversations();
    }

    onPaginationNextPageChange({ offset }) {
        const { perPage } = this.state;
        const nextPage = (offset / perPage) + 1;

        this.setState({ currentPage: nextPage }, () => {
          this.fetchConversations(nextPage);
        });
    }

    async fetchConversations(page = 1) {
        const { EventHandler, conversationActions } = this.props;
        const { type, conversations, perPage } = this.state;
        this.setState({ isLoadingConversations: true });

        try {
            const fetchConversationsResult = await conversationActions.fetchConversations(page, type, 10, perPage, false);
            this.setState({ conversations: { ...conversations, items: fetchConversationsResult.data.Data.objects, totalCount: fetchConversationsResult.data.Data.meta.totalCount } });
        } catch (exception) {
            EventHandler.handleException(exception);
        } finally {
            this.setState({ isLoadingConversations: false });
        }
    }

    render() {
        const { account, EventHandler, alertActions, conversationActions, currentPage, loggedInUserRole, windowDimensions, audiencesActions } = this.props;
        const { conversations, type, isLoadingConversations, perPage } = this.state;

        return (
            <div style={{ width: '100%' }}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '100%'}}>
                    <div style={{flexDirection: 'column', flex: 1, display: 'flex', backgroundColor: '#fff', position: 'sticky', zIndex: 2, top: 48, borderBottom: '1px solid #e0e0e0'}}>
                        <PaginationNext
                            totalItems={conversations.totalCount ? conversations.totalCount : 0}
                            perPage={perPage}
                            onPageChange={this.onPaginationNextPageChange}
                            isLoading={isLoadingConversations}
                            currentPage={parseInt(currentPage, 10) - 1}
                            visibleItems={conversations.items.length}
                        />
                    </div>
                    {
                        isLoadingConversations ? (
                            <div
                                style={{
                                width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                            <Spinner spinnerColor={primaryColor} size={40} spinnerWidth={4} />
                            <span style={{ margin: 20 }}>Loading surveys</span>
                          </div>
                        ) : (!conversations.items.length) ? (
                            <div
                                style={{
                                    width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <ErrorState text='No surveys have been sent to this segment' />
                            </div>
                        ) : (
                            conversations.items.map((conversation) => (
                                <WideConversationListItem
                                    account={account}
                                    audiences={[]}
                                    loggedInUserRole={loggedInUserRole}
                                    audiencesActions={audiencesActions}
                                    isFetchingAudiences={false}
                                    EventHandler={EventHandler}
                                    alertActions={alertActions}
                                    key={conversation.id}
                                    conversation={conversation}
                                    conversationActions={conversationActions}
                                    listType={type}
                                    windowDimensions={windowDimensions}
                                />
                            ))
                        )
                    }
                </div>
            </div>
        );
    }
}  