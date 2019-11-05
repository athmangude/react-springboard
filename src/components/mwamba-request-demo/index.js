/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import SidePanel from 'Layouts/simple-layout-extended/components/SidePanel';
// import RequestDemoFrom from './RequestDemoForm';
import ActionButton from '../action-button-styled';
import styles from './index.css';
const MwambaRequestDemoWrapper = styled.div`${styles}`

export default class MwambaRequestDemo extends Component {
    static propTypes = {
        blur: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            blur: false,
            sidePanel: null,
            showSidePanel: false,
            hovered: false,
            opacity: 1 ,
            open: false,
            content: '',
            isRequestingDemo: false,
        };

        this.onRequestDemo = this.onRequestDemo.bind(this);
        this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.addOpacity = this.addOpacity.bind(this);
        this.removeOpacity = this.removeOpacity.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.requestDemo = this.requestDemo.bind(this);
    }

    onRequestDemo() {
        this.setState({ showSidePanel: true });
    }

    onCloseSidePanel() {
        this.setState({ showSidePanel: false });
    }

    onMouseEnter() {
        // this.addInterval = setInterval(this.addOpacity, 50);

        this.setState({ hovered: true });
    }

    onMouseLeave() {
        // this.removeInterval = setInterval(this.removeOpacity, 50);
        this.setState({ hovered: false });
    }

    addOpacity() {
        this.setState({
          opacity: this.state.opacity + 0.2
        })
        if(this.state.opacity >= 1) { 
          clearInterval(this.addInterval);
        }
    }

    openDialog() {
        this.setState({ open: true });
    }

    handleChange(e) {
        this.setState({ content: e.target.value });
    }

    handleClose() {
        this.setState({ open: false });
    }

    removeOpacity() {
        this.setState({
            opacity: this.state.opacity - 0.2
          })
          if(this.state.opacity <= 0.2) { 
            clearInterval(this.removeInterval);
            this.setState({ hovered: false });
          }
    }

    async requestDemo() {
        const { onCloseSidePanel, alertActions } = this.props;
    
        this.setState({ isRequestingDemo: true });
    
        setTimeout(() => {
          this.setState({ isRequestingDemo: false, open: false });
          alertActions.addAlert({ type: 'success', message: 'Your demo request has been submitted!' });
        }, 2000);
    }

    render() {
        const { children, EventHandler, alertActions } = this.props;
        const { showSidePanel, hovered, opacity, open, content, isRequestingDemo } = this.state;
        
        return (
            <MwambaRequestDemoWrapper opacity={opacity}>
                {/* {
                    showSidePanel ? (
                    <SidePanel component={(<RequestDemoFrom onCloseSidePanel={this.onCloseSidePanel} EventHandler={EventHandler} alertActions={alertActions} />)} style={{ zIndex: 5 }} />
                    ) : null
                } */}
                <div className="content" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                    {children}
                    {
                        hovered ? (
                            <div className="blured-component">
                                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24 }}>Understand your customers segments better with informative analytics on spend, loyalty & satisfaction, behaviour and demographics</span>
                                <ActionButton onClick={this.openDialog} text="Request&nbsp;a&nbsp;demo" style={{ backgroundColor: '#bf2a2c', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5, marginTop: 10 }} />
                            </div> 
                        ) : null
                    }
                    <Dialog
                        open={open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"What to expect"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        <div>
                            {/* <p style={{ textAlign: 'left', height: 18, margin: '16px 0 8px 0', color: '#4a4a4a', font: '300 18px/14px Roboto,sans-serif', letterSpacing: 0 }}>What to expect</p> */}
                            <div style={{ display: 'flex', paddingBottom: 10 }}>
                                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                                <p style={{ textAlign: 'left' }}>Learn the features of customer analytics</p>
                            </div>
                            <div style={{ display: 'flex', paddingBottom: 10 }}>
                                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                                <p style={{ textAlign: 'left' }}>Build efficient and robust segments that will help you manage, track and engage your customers</p>
                            </div>
                            <div style={{ display: 'flex', paddingBottom: 10 }}>
                                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                                <p style={{ textAlign: 'left' }}>Understand your customers better and drive meaningful action</p>
                            </div>
                            <div style={{ display: 'flex', paddingBottom: 10 }}>
                                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                                <p style={{ textAlign: 'left' }}>Answer any other question that you may have</p>
                            </div>
                            <div style={{ display: 'flex', paddingBottom: 10 }}>
                                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                                <p style={{ textAlign: 'left' }}>No commitment required</p>
                            </div>

                            <div style={{ display: 'flex', paddingBottom: 10 }}>
                                <p style={{ textAlign: 'left' }}>Have any questions you want answered during the demo? Add them below.</p>
                            </div>

                            <div style={{ margin: '20px 0 0 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <div style={{ width: '100%', margin: '0 5px' }}>
                                    <textarea
                                    placeholder="Optional message"
                                    onChange={this.handleChange}
                                    name="textAreaInput" value={content}
                                    className="hide-active-border"
                                    style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%', backgroundColor: '#ffffff', display: 'block', width: '100%', minHeight: 80, maxHeight: 300, resize: 'vertical', color: 'rgb(109, 110, 113)' }}
                                    />
                                </div>
                            </div>
                        </div>
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <ActionButton
                            onClick={this.handleClose}
                            style={{ border: 'none' }}
                            text="Cancel"
                        />

                        <ActionButton
                            onClick={this.requestDemo}
                            style={{ border: 'none' }}
                            loading={isRequestingDemo}
                            text="Request&nbsp;demo"
                        />
                        </DialogActions>
                    </Dialog>
                </div>        
            </MwambaRequestDemoWrapper>
        )
    }

}