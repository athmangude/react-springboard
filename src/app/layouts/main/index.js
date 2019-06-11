import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { ThemeProvider } from 'styled-components';
import { Helmet } from "react-helmet";

import themes from '../../themes';

import './main.css';
import styles from './index.styles';

import usabilityImage from 'Images/usability.png';

const MainLayoutWrapper = styled.main`${styles}`;

@connect((state) => ({
  ...state
}), (dispatch) => ({

}))
export default class MainLayout extends Component {
  render() {
    const theme = themes.dark;
    return (
      <ThemeProvider theme={theme}>
        <MainLayoutWrapper style={{ width: '100%' }}>
          <Helmet>
            <meta name="theme-color" content={theme.secondaryColor} />
            <meta name="background-color" content={theme.darkPrimaryColor} />
          </Helmet>
          <aside className="main">
            <Link to="/" style={{ color: '#fff', fontSize: 25, textDecoration: 'none', textTransform: 'uppercase', fontWeight: 'bold', marginLeft: 10 }}>Spring Board</Link>
          </aside>
          <section className="main">
            {this.props.children}
          </section>
        </MainLayoutWrapper>
      </ThemeProvider>
    )
  }
}
