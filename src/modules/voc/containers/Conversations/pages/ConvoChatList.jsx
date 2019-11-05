import React from 'react';
import { Icon, Grid, Segment, Input, Divider, Form, TextArea } from 'semantic-ui-react';
import {
	MessageBox,
	ChatList,
} from 'react-chat-elements';

import classNames from 'classnames';

import mouseTrap from 'react-mousetrap';

import request from 'superagent';
import { Scrollbars } from 'react-custom-scrollbars';
import Dimmable from '../../common/lists/Dimmable';
import user from '../.././common/resources/user.svg';
import { chats } from '../../common/dummy.json';
import 'react-chat-elements/dist/main.css';
import './ChatList.css';


class ConvoChatList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
      messageList: [],
      messageId: null,
      newMessage: '',
    };
    this.switchMessage = this.switchMessage.bind(this);
    this.onNewMessage = this.onNewMessage.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  componentWillMount() {
        // setInterval(this.addMessage.bind(this), 3000);
				// this.props.bindShortcut('enter', this.addMessage)
    request.get('http://localhost:30001/chats')
		      .withCredentials()
		      .end((err, res) => {
		        if (err || !res.ok) {
		          console.error(err);
          this.setState({
            messageList: [...chats],
            messageId: chats[0].token,
							 });
		        } else {
		          this.setState({
            messageList: [...res.body],
            messageId: res.body[0].token,
							 });
		        }
		      });
  }

  componentWillUnmount() {
			// this.props.unbindShortcut('enter');
  }

  onNewMessage(event) {
    event.preventDefault();
    this.setState({ newMessage: event.target.value });
  }

  switchMessage(data) {
    this.setState({
      messageId: data.id,
    });
  }


  addMessage() {
    const { messageList, newMessage, messageId } = this.state;
    const message = {
      text: newMessage,
        	timestamp: new Date(),
        	sender: 'ADMIN',
    };
    messageList.forEach((message) => {
      if (message.token === messageId) { message.messages.push(message); }
    });
    this.setState({
      messageList: [...messageList],
      newMessage: '',
    });
  }

  render() {
    const { messageList, messageId, newMessage } = this.state;
    const currentChat = messageList.find((message) => message.token === messageId);
    return (
      <Dimmable
        itemsExpected={10}
        show={false}
        warning="You dont have any Chats"
        actionText="Create New"
      >
        <div className="top">
          <div className="name-box">
            <span>
		              Convo: Chat with <i>{ currentChat ? currentChat.commId : null}</i>
            </span>
          </div>
          <div className="options" id="options" title="Auto Saving">
          </div>
        </div>

        <div className="list one column row">

          <Grid columns={2} divided padded="horizontally">
            <Grid.Column width={4} style={{ minWidth: '20em' }}>
              <Input fluid icon="search" placeholder="Search" />
              <Divider />
              <Scrollbars
                style={{ height: '65vh' }}
              >
                {
										 messageList.map((message) => (
  <ChatList
    onClick={this.switchMessage}
    className={classNames('chat-list', { active: (message.token === currentChat.token) })}
    dataSource={[
   										        {
        avatar: user,
   										            alt: message.commId,
   										            title: message.commId,
   										            subtitle: message.messages[0].text,
   										            date: new Date(message.messages[0].timestamp),
   										            unread: message.messages.length,
        id: message.token,
   										        },
   										    ]}
  />
											))
									 }
              </Scrollbars>
            </Grid.Column>
            <Grid.Column
              width={11} style={{
									 display: 'flex',
									 flexDirection: 'column',
									 transition: '0.4s',
									 }}
            >
              <div
                style={{
											 width: '100%',
											 height: '100%',
										 }}
              >
                <Scrollbars
                  renderTrackHorizontal={() => <div />}
                  style={{ height: '100%' }}
                >
                  {
										 currentChat ? currentChat.messages.map((chat) => (
  <MessageBox
    position={chat.sender === 'ADMIN' ? 'left' : 'right'}
    type="text"
    text={chat.text}
    date={new Date(chat.timestamp)}
    data={{
		 					 						date: new Date(chat.timestamp),
		 								    }}
  />
											)) : null
									 }
                </Scrollbars>
              </div>
              <Form style={{ display: 'flex', marginTop: 'auto' }}>
                <TextArea key="newMessage" placeholder="Type Here" value={newMessage} onChange={this.onNewMessage} />
              </Form>
              <small style={{ color: 'grey' }}>Press Enter to send, Shift + Enter for new line</small>
            </Grid.Column>
          </Grid>
        </div>
      </Dimmable>
    );
  }
}

export default ConvoChatList;
