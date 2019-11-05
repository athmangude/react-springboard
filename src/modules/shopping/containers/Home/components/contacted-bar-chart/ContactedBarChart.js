import React from 'react';

import './ContactedBarChart.css';
let d3 = {};
const build = () => {
  const defaults = {
  width : 1000,
  height: 150,
  margin: {
    top   : 15,
    right : 0,
    bottom: 35,
    left  : 60
  },
  axis: true,
  axisPadding: 5,
  tickSize: 10,
  barPadding: 5,
  ease: d3.easeLinear,
  nice: true,
  type: 'rounded'
};

class BarChart {

  constructor (element, options) {
    Object.assign(this, defaults, options);

    this.element = element;
    this.init();
  }

  dimensions() {
    const { margin } = this;

    return [
      this.width - margin.left - margin.right,
      this.height - margin.top - margin.bottom
    ];
  }

  init() {
    const { margin, tickSize, axisPadding } = this;
    const [ innerWidth, innerHeight ] = this.dimensions();

    this.graph = d3.select(this.element)

    const svg = this.svg = this.graph
      .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const scaleX = this.scaleX = d3
      .scaleTime()
      .range([0, innerWidth]);

    const scaleY = this.scaleY = d3
      .scaleLinear()
      .range([innerHeight, 0]);

    const xAxis = this.xAxis = d3.axisBottom(scaleX)
      .ticks(5)
      .tickPadding(8)
      .tickSize(tickSize);

    const yAxis = this.yAxis = d3.axisLeft(scaleY)
      .ticks(3)
      .tickPadding(8)
      .tickSize(tickSize);

    svg
      .append('g')
        .attr('class', 'chart__axis chart__axis--x')
        .attr('transform', `translate(0, ${innerHeight + axisPadding})`)
        .call(xAxis);

    svg
      .append('g')
        .attr('class', 'chart__axis chart__axis--y')
        .attr('transform', `translate(${-axisPadding}, 0)`)
        .call(yAxis);
  }

  renderAxis(data, options) {
    let { svg } = this;

    svg = options.animate ? svg.transition() : svg;

    svg
      .select('.chart__axis--x')
      .call(this.xAxis);

    svg
      .select('.chart__axis--y')
      .call(this.yAxis);
  }

  renderBars(data, options) {
    const { svg, scaleX, scaleY, barPadding, type, ease } = this;
    const [ innerWidth, innerHeight ] = this.dimensions();
    const barWidth = innerWidth / data.length - barPadding;

    const column = svg
      .selectAll('.chart__column')
      .data(data);

    column
      .enter()
      .append('rect')
        .attr('class', 'chart__column');

    (options.animate ? svg.selectAll('.chart__column').transition().ease(ease) : svg.selectAll('.chart__column'))
      .attr('x', data => scaleX(data.date) - barWidth / 2)
      .attr('rx', type === 'rounded' ? barWidth / 2 : 0)
      .attr('ry', type === 'rounded' ? barWidth / 2 : 0)
      .attr('width', barWidth)
      .attr('height', innerHeight);

    column
      .exit()
      .remove();

    const bar = svg
      .selectAll('.chart__bar')
      .data(data);

    bar
      .enter()
      .append('rect')
        .attr('class', 'chart__bar');

    (options.animate ? svg.selectAll('.chart__bar').transition().ease(ease) : svg.selectAll('.chart__bar'))
      .attr('x', data => scaleX(data.date) - barWidth / 2)
      .attr('y', data => scaleY(data.value))
      .attr('rx', type === 'rounded' ? barWidth / 2 : 0)
      .attr('ry', type === 'rounded' ? barWidth / 2 : 0)
      .attr('width', barWidth)
      .attr('height', data => innerHeight - scaleY(data.value));

    bar
      .exit()
      .remove();
  }

  render(data, options = {}) {
    const { scaleX, scaleY } = this;
    const domainX = scaleX.domain(d3.extent(data, data => data.date));
    const domainY = scaleY.domain([0, d3.max(data, data => data.value)]);

    if (this.nice) {
      domainX.nice();
      domainY.nice();
    }

    if (this.axis) {
      this.renderAxis(data, options);
    }

    this.renderBars(data, options);
  }

  update(data, options) {
    this.render(data, {
      animate: true
    });
  }

}

function generateData(n) {
  const data = [];

  while (n--) {
    data.push({
      date: new Date(Date.now() - (n * 1000 * 60 * 60 * 24)),
      value: generateRandomInteger(0, 12)
    });
  }

  return data;
}

function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const barChart = new BarChart('.js-bar-chart');

barChart.render(generateData(60));

document.querySelector('.js-bar-chart-update').addEventListener('click', () => barChart.update(generateData(24)));
}

const ContactedBarChart = (props) => {
  return (
    <svg width={1000} height={150}><g transform="translate(60, 15)"><g className="chart__axis chart__axis--x" transform="translate(20, 105)" fill="none" fontSize={10} fontFamily="sans-serif" textAnchor="middle"><path className="domain" stroke="#000" d="M0.5,10V0.5H940.5V10" /><g className="tick" opacity={1} transform="translate(0,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">May 28</text></g><g className="tick" opacity={1} transform="translate(104.44444444444444,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jun 04</text></g><g className="tick" opacity={1} transform="translate(208.88888888888889,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jun 11</text></g><g className="tick" opacity={1} transform="translate(313.3333333333333,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jun 18</text></g><g className="tick" opacity={1} transform="translate(417.77777777777777,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jun 25</text></g><g className="tick" opacity={1} transform="translate(522.2222222222223,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jul 02</text></g><g className="tick" opacity={1} transform="translate(626.6666666666666,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jul 09</text></g><g className="tick" opacity={1} transform="translate(731.1111111111111,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jul 16</text></g><g className="tick" opacity={1} transform="translate(835.5555555555555,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jul 23</text></g><g className="tick" opacity={1} transform="translate(940,0)"><line stroke="#000" y2={10} x1="0.5" x2="0.5" /><text fill="#000" y={18} x="0.5" dy="0.71em">Jul 30</text></g></g><g className="chart__axis chart__axis--y" transform="translate(-5, 0)" fill="none" fontSize={10} fontFamily="sans-serif" textAnchor="end"><path className="domain" stroke="#000" d="M-10,100.5H0.5V0.5H-10" /><g className="tick" opacity={1} transform="translate(0,100)"><line stroke="#000" x2={-10} y1="0.5" y2="0.5" /><text fill="#000" x={-18} y="0.5" dy="0.32em">0</text></g><g className="tick" opacity={1} transform="translate(0,58.33333333333333)"><line stroke="#000" x2={-10} y1="0.5" y2="0.5" /><text fill="#000" x={-18} y="0.5" dy="0.32em">5</text></g><g className="tick" opacity={1} transform="translate(0,16.666666666666657)"><line stroke="#000" x2={-10} y1="0.5" y2="0.5" /><text fill="#000" x={-18} y="0.5" dy="0.32em">10</text></g></g><rect className="chart__column" x="16.352564583333336" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="31.273199503968254" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="46.193834424603175" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="61.1144693452381" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="76.03510426587303" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="90.95573918650794" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="105.87637410714287" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="120.79700902777778" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="135.71764394841267" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="150.6382788690476" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="165.55891378968255" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="180.47954871031746" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="195.40018363095237" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="210.3208185515873" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="225.24145347222222" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="240.16208839285713" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="255.08272331349204" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="270.003358234127" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="284.9239931547619" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="299.8446280753968" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="314.76526299603177" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="329.68589791666665" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="344.6065328373016" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="359.5271677579365" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="374.4478026785714" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="389.3684375992064" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="404.28907251984134" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="419.2097074404762" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="434.13034236111116" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="449.0509772817461" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="463.971612202381" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="478.8922471230159" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="493.8128820436508" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="508.7335169642858" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="523.6541518849206" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="538.5747868055555" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="553.4954217261904" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="568.4160566468254" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="583.3366915674602" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="598.2573264880953" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="613.1779614087301" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="628.098596329365" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="643.01923125" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="657.9398661706349" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="672.8605010912697" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="687.7811361845972" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="702.7017711052322" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="717.6224060258671" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="732.543040946502" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="747.463675867137" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="762.3843107877718" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="777.3049457084068" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="792.2255806290417" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="807.1462155496766" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="822.0668504703115" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="836.9874853909465" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="851.9081203115813" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="866.8287552322163" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="881.7493901528512" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__column" x="896.6700250734862" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__bar" x="16.352564583333336" y={75} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={25} /><rect className="chart__bar" x="31.273199503968254" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="46.193834424603175" y="41.666666666666664" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="58.333333333333336" /><rect className="chart__bar" x="61.1144693452381" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="76.03510426587303" y="16.666666666666657" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="83.33333333333334" /><rect className="chart__bar" x="90.95573918650794" y="83.33333333333334" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="16.666666666666657" /><rect className="chart__bar" x="105.87637410714287" y="58.33333333333333" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="41.66666666666667" /><rect className="chart__bar" x="120.79700902777778" y="83.33333333333334" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="16.666666666666657" /><rect className="chart__bar" x="135.71764394841267" y="58.33333333333333" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="41.66666666666667" /><rect className="chart__bar" x="150.6382788690476" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="165.55891378968255" y={75} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={25} /><rect className="chart__bar" x="180.47954871031746" y="58.33333333333333" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="41.66666666666667" /><rect className="chart__bar" x="195.40018363095237" y="83.33333333333334" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="16.666666666666657" /><rect className="chart__bar" x="210.3208185515873" y={100} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={0} /><rect className="chart__bar" x="225.24145347222222" y="66.66666666666667" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="33.33333333333333" /><rect className="chart__bar" x="240.16208839285713" y="16.666666666666657" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="83.33333333333334" /><rect className="chart__bar" x="255.08272331349204" y="41.666666666666664" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="58.333333333333336" /><rect className="chart__bar" x="270.003358234127" y={75} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={25} /><rect className="chart__bar" x="284.9239931547619" y="8.333333333333343" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="91.66666666666666" /><rect className="chart__bar" x="299.8446280753968" y={75} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={25} /><rect className="chart__bar" x="314.76526299603177" y="8.333333333333343" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="91.66666666666666" /><rect className="chart__bar" x="329.68589791666665" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="344.6065328373016" y={0} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__bar" x="359.5271677579365" y="91.66666666666667" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="8.333333333333329" /><rect className="chart__bar" x="374.4478026785714" y="41.666666666666664" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="58.333333333333336" /><rect className="chart__bar" x="389.3684375992064" y="58.33333333333333" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="41.66666666666667" /><rect className="chart__bar" x="404.28907251984134" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="419.2097074404762" y="16.666666666666657" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="83.33333333333334" /><rect className="chart__bar" x="434.13034236111116" y="16.666666666666657" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="83.33333333333334" /><rect className="chart__bar" x="449.0509772817461" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="463.971612202381" y="33.33333333333334" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="66.66666666666666" /><rect className="chart__bar" x="478.8922471230159" y={100} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={0} /><rect className="chart__bar" x="493.8128820436508" y={25} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={75} /><rect className="chart__bar" x="508.7335169642858" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="523.6541518849206" y={75} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={25} /><rect className="chart__bar" x="538.5747868055555" y={0} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__bar" x="553.4954217261904" y="8.333333333333343" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="91.66666666666666" /><rect className="chart__bar" x="568.4160566468254" y="83.33333333333334" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="16.666666666666657" /><rect className="chart__bar" x="583.3366915674602" y={25} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={75} /><rect className="chart__bar" x="598.2573264880953" y="41.666666666666664" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="58.333333333333336" /><rect className="chart__bar" x="613.1779614087301" y="16.666666666666657" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="83.33333333333334" /><rect className="chart__bar" x="628.098596329365" y="41.666666666666664" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="58.333333333333336" /><rect className="chart__bar" x="643.01923125" y="83.33333333333334" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="16.666666666666657" /><rect className="chart__bar" x="657.9398661706349" y="33.33333333333334" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="66.66666666666666" /><rect className="chart__bar" x="672.8605010912697" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="687.7811361845972" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="702.7017711052322" y={75} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={25} /><rect className="chart__bar" x="717.6224060258671" y="83.33333333333334" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="16.666666666666657" /><rect className="chart__bar" x="732.543040946502" y={100} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={0} /><rect className="chart__bar" x="747.463675867137" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="762.3843107877718" y="66.66666666666667" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="33.33333333333333" /><rect className="chart__bar" x="777.3049457084068" y="41.666666666666664" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="58.333333333333336" /><rect className="chart__bar" x="792.2255806290417" y="41.666666666666664" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="58.333333333333336" /><rect className="chart__bar" x="807.1462155496766" y={0} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__bar" x="822.0668504703115" y={50} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={50} /><rect className="chart__bar" x="836.9874853909465" y={75} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={25} /><rect className="chart__bar" x="851.9081203115813" y="58.33333333333333" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="41.66666666666667" /><rect className="chart__bar" x="866.8287552322163" y={0} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={100} /><rect className="chart__bar" x="881.7493901528512" y={75} rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height={25} /><rect className="chart__bar" x="896.6700250734862" y="41.666666666666664" rx="5.333333333333333" ry="5.333333333333333" width="10.666666666666666" height="58.333333333333336" /></g></svg>

  )
}

export default ContactedBarChart
