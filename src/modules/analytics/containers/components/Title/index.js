/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

const styles = {
  tooltip: {
    font: '300 12px/14px Roboto,sans-serif',
    letterSpacing: 0,
    lineHeight: 1.8,
  },
};

const Title = ({ title, subtitle = '', help = '', classes, loading = false }) => (
  loading ? (
    <ReactPlaceholder
      showLoadingAnimation
      customPlaceholder={(
        <div style={{ width: '100%', marginBottom: 5 }}>
          <RectShape color="#fff" style={{ height: 20, marginBottom: 5, width: 100 }} />
          <RectShape color="#fff" style={{ height: 20, width: 200 }} />
        </div>
      )}
    />
  ) : (
    <div style={{ width: '100%', margin: '16px 0 8px' }}>
      <div style={{ color: '#4a4a4a', font: '300 18px/14px Roboto,sans-serif', letterSpacing: 0, lineHeight: 1.2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <span>{title}</span>
        {
          help ? (
            <Tooltip title={help} placement="right" classes={{ tooltip: classes.tooltip }}>
              <i className="material-icons" style={{ marginLeft: 10, fontSize: 18 }}>help_outline</i>
            </Tooltip>
          ) : null
        }
      </div>
      {
        subtitle.trim().length ? (
          <div style={{ margin: '6px 0 0', color: '#4a4a4a', font: '300 13px/14px Roboto,sans-serif', letterSpacing: 0 }}>{subtitle}</div>
        ) : null
      }
    </div>
  )
);

Title.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  help: PropTypes.string,
  classes: PropTypes.object,
  loading: PropTypes.bool,
};

export default withStyles(styles)(Title);
