/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import wrapperBackground from 'Images/empty_list_background.png';
import CustomerAnalyticsUpgrade from 'Images/customer_analytics_upgrade.png'
import ActionButton from '../action-button-styled';
import themes from 'SharedComponents/themes';
const { primaryColor, lightPrimaryColor } = themes.light;

const UpgradeModal = ({ open, onCloseModal, text }) => {
    return (
        <Dialog
            open={open}
            onClose={onCloseModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent style={{ flex: 1, flexDirection: 'column', display: 'flex', padding: 0, minHeight: '50vh', maxHeight: '50vh' }}>
                <div style={{
                    flex: 1,
                    flexDirection: 'row',
                    display: 'flex',
                    backgroundColor: primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    <div style={{ flex: 1, flexDirection: 'column', display: 'flex' }}>
                        <p style={{ paddingLeft: 20, paddingRight: 20, fontSize: 18, color: 'white' }}>Customer analytics has not been enabled for your account. Upgrade to gain more insights on your customers</p>
                    </div>
                    <div style={{ flex: 1, flexDirection: 'column', height: '17vh', width: '90%', backgroundImage: `url(${CustomerAnalyticsUpgrade})`, backgroundSize: 'cover' }} />
                </div>
                <div style={{ flex: 1, flexDirection: 'column', display: 'flex', padding: 20 }}>
                    <div style={{ flexDirection: 'column', display: 'flex'}}>
                        <p>{text}</p>
                    </div>
                    <div style={{ flex: 1, flexDirection: 'column', display: 'flex'}}>
                        <div style={{ flex: 1, flexDirection: 'row', display: 'flex'}}>
                            <div style={{ flex: 1, flexDirection: 'row', display: 'flex'}}>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                    <i className="material-icons" style={{ fontSize: 42, marginRight: 10, color: primaryColor }}>show_chart</i>
                                </div>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ fontSize: 14, marginBottom: 5 }}>Spend</p>
                                    <p style={{ fontSize: 12 }}>Know where and when your customers are spending.</p>
                                </div>
                            </div>
                            <div style={{ flex: 1, flexDirection: 'row', display: 'flex'}}>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                    <i className="material-icons" style={{ fontSize: 42, marginRight: 10, color: primaryColor }}>whatshot</i>
                                </div>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ fontSize: 14, marginBottom: 5 }}>Behavior</p>
                                    <p style={{ fontSize: 12 }}>How do your customers behave</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1, flexDirection: 'row', display: 'flex'}}>
                            <div style={{ flex: 1, flexDirection: 'row', display: 'flex'}}>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                    <i className="material-icons" style={{ fontSize: 42, marginRight: 10, color: primaryColor }}>show_chart</i>
                                </div>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ fontSize: 14, marginBottom: 5 }}>Loyalty and Satisfaction</p>
                                    <p style={{ fontSize: 12 }}>What are the key things your customers value</p>
                                </div>
                            </div>
                            <div style={{ flex: 1, flexDirection: 'row', display: 'flex'}}>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                    <i className="material-icons" style={{ fontSize: 42, marginRight: 10, color: primaryColor }}>map</i>
                                </div>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ fontSize: 14, marginBottom: 5 }}>Demographics</p>
                                    <p style={{ fontSize: 12 }}>Where are you customers situated</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
            <ActionButton
                onClick={onCloseModal}
                style={{ border: 'none', backgroundColor: primaryColor, color: '#fff' }}
                text="Upgrade"
            />
            <ActionButton
                onClick={onCloseModal}
                style={{ border: 'none', backgroundColor: lightPrimaryColor, color: primaryColor }}
                text="Cancel"
            />
            </DialogActions>
        </Dialog>
    );
}

export default UpgradeModal;