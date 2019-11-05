import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import ContainerDimensions from 'react-container-dimensions';
import { Popup } from 'semantic-ui-react';
import './BarChartAlternate.css';

const barSize = 70;

class BarChartAlternate extends Component {
  state = { setFill: false };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ setFill: true })
    }, 250);
  }

  render() {
    const { question } = this.props;
    const total = Object.entries(question.responses).reduce((accumulator, currentValue) => accumulator + Number(currentValue[1]), 0);

    let chartData = Object.entries(question.responses).map((response) => ({
      name: response[0],
      count: Number(response[1]),
      percentage: this.state.setFill ? parseInt(Number(response[1]) / total * 100).toFixed(0) : 0,
    })).sort((a, b) => b.count - a.count).map((response, i) => ({
      ...response,
      fill: `rgba(72, 125, 179, ${0.5 + (0.5 * (Object.entries(question.responses).length / (Object.entries(question.responses).length + i)))}`,
    }));

    return (
      <div className="custom-tab" style={{ backgroundColor: '#FFF', padding: 10, width: '100%' }}>
        {
          chartData.map((row) => {
            const label = row.name.replace(/([A-Z]+)/g, ' $1');
            const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
            return (
              <div style={{ display: 'flex', alignItems: 'space-between', height: 35, margin: '5px 0 5px' }}>
                <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}>
                  <Popup
                    trigger={<span style={{ color: '#888888', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{capitalizedLabel}</span>}
                    content={capitalizedLabel}
                    basic
                    inverted
                    hoverable
                    style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                  />
                </div>
                <div style={{ width: '60%', margin: 0, backgroundColor: '#f7f7f7', height: '100%' }}>
                  <div style={{ width: `${row.percentage}%`, backgroundImage: 'linear-gradient(to left, #5b8dc2, rgba(102, 151, 203, 0.5))', height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s', borderBottomRightRadius: 17.5, borderTopRightRadius: 17.5 }}></div>
                </div>
                <div style={{ width: '15%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}><span style={{ color: '#888888' }}>{`${row.percentage}% (${row.count})`}</span></div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

BarChartAlternate.propTypes = {
  question: PropTypes.object.isRequired,
};

export default BarChartAlternate;
