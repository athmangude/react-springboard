import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Case from 'case';
import { Icon, Image } from 'semantic-ui-react';

import ProfileActions from './ProfileActions';
import './SidePanel.css';

const menuItems = [
  { title: 'Home', icon: 'home', url: '/' },
  { title: 'Workspace', icon: 'comments', url: '/workspace' },
  { title: 'Audience', icon: 'users', url: '/audiences' },
  // { title: 'Customers', icon: 'user', url: '/' },
  { title: 'Convo', icon: 'wechat', url: '/convo' },
];

@connect((state) => ({
  user: state.authentication.user,
}))
class SidePanel extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  render() {
    const displayName = Case.capital(this.props.user.firstName || this.props.user.email.substring(0, this.props.user.email.lastIndexOf('@')));
    return (
      <section className="side-panel" style={{ minWidth: 65 }}>
        <nav>
          <ul>
            {
              menuItems.map((item) => (
                <li key={item.title.toString()}>
                  <Link to={item.url}><Icon name={item.icon} size="tiny" style={{ fontSize: '10px !important' }} /><span style={{ fontSize: 8 }}>{item.title}</span></Link>
                </li>
              ))
            }
          </ul>
        </nav>
        <footer style={{ bottom: '120px' }}>
          <div className="title">
            <div className="profile-wrap">
              <ProfileActions
                user={displayName}
                trigger={(
                  <Image
                    avatar
                    src="https://dbon8wsz1nyjy.cloudfront.net/wp-content/uploads/2017/01/java-house-africa-300x300.jpg"
                    style={{ height: '3em', width: '3em' }}
                  />
                )}
              />
            </div>
          </div>
        </footer>
      </section>
    );
  }
}

export default SidePanel;
