import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import { Popup } from 'semantic-ui-react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const ENTER_KEY = 13;

const convertUnicode = (input) =>
  input.replace(/\\u(\w\w\w\w)/g, (a, b) => {
    const charcode = parseInt(b, 16);
    return String.fromCharCode(charcode);
  });

const toUTF16 = (input) => {
  let codePoint = input;
  const TEN_BITS = parseInt('1111111111', 2);
  function u(codeUnit) {
    return '\\u'.concat(codeUnit.toString(16).toUpperCase());
  }

  if (codePoint <= 0xFFFF) {
    return u(codePoint);
  }
  codePoint -= 0x10000;

  // Shift right to get to most significant 10 bits
  const leadSurrogate = 0xD800 + (codePoint >> 10);

  // Mask to get least significant 10 bits
  const tailSurrogate = 0xDC00 + (codePoint & TEN_BITS);

  return convertUnicode(u(leadSurrogate) + u(tailSurrogate));
};

export default class SendMessage extends Component {

  static propTypes = {
    sendMessageHandler: PropTypes.func.isRequired,
    participantId: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addEmoticon = this.addEmoticon.bind(this);
  }

  state = {
    isSubmitting: false,
    message: '',
  }

  componentWillReceiveProps(newProps) {
    if (this.props.participantId !== newProps.participantId) {
      this.setState({ isSubmitting: false, message: '' });
    }
  }

  onKeyDown(e) {
    const { isSubmitting } = this.state;
    if (e.keyCode === ENTER_KEY && !isSubmitting) {
      this.onSubmit();
    }
  }

  async onSubmit() {
    this.setState({ isSubmitting: true });
    const { message } = this.state;
    const { participantId } = this.props;
    if (!message || !message.trim()) {
      this.setState({ isSubmitting: false });
      return;
    }

    await this.props.sendMessageHandler(message, participantId);
    this.setState({ isSubmitting: false, message: '' });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  addEmoticon(emoji) {
    const { message } = this.state;
    const codepoint = emoji.native.codePointAt(0);
    const unicode = toUTF16(codepoint);
    this.setState({ message: message.concat(unicode) });
  }

  render() {
    const { message, isSubmitting } = this.state;
    const { loading, width } = this.props;

    return (
      <div style={{ height: width ? 425 > 70 : 140, width: '100%', display: 'flex', flexDirection: width > 425 ? 'row' : 'column', justifyContent: 'center', alignItems: 'center', position: width > 425 ? 'relative' : 'relative', bottom: 0 }}>
        <div style={{ width: width > 425 ? 'calc(100% - 160px)' : '100%', height: 70 }}>
          <input style={{ padding: '0 45px 0 20px', width: '100%', height: 70, backgroundColor: '#ffffff', border: 'solid 1px #d9d9d9', fontSize: 12, letterSpacing: 0.6, color: '#808285' }} placeholder="Type your message..." name="message" value={message} onChange={this.handleChange} onKeyDown={this.onKeyDown} />
          {
            !loading ? (
              <div style={{ position: 'absolute', bottom: width > 425 ? 0 : 70, left: width > 425 ? 'calc(100% - 270px)' : 'calc(100% - 115px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Popup
                  trigger={<i className="material-icons" style={{ color: '#fb8c00' }}>sentiment_very_satisfied</i>}
                  content={<Picker onSelect={this.addEmoticon} showPreview={false} style={{ border: 'none' }} />}
                  basic
                  on="click"
                  hideOnScroll
                  style={{ padding: 0 }}
                />
                <span style={{ fontSize: 10, letterSpacing: 0.7, color: '#808285' }}>Character count: {message.length}</span>
              </div>
            ) : null
          }
        </div>
        <button onClick={this.onSubmit} disabled={isSubmitting} style={{ width: width > 425 ? 160 : '100%', height: 70, backgroundColor: '#33597f', fontSize: 12, letterSpacing: 0.6, color: '#ffffff', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
          <span style={{ paddingRight: 5 }}>SEND</span>
          {
            isSubmitting ? (<Spinner spinnerColor="#ffffff" size={30} spinnerWidth={3} />) : (<i className="material-icons" style={{ fontSize: 20 }}>send</i>)
          }
        </button>
      </div>
    );
  }
}
