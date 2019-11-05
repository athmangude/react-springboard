import React from 'react';
import {
    BarChart as BChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LabelList,
    Rectangle,
    ResponsiveContainer
} from 'recharts';

import Case from "case";

const COLORS = ['#58595b', '#6d6e71', '#808285', '#d9d9d9'];

const colorFetcher = (index) => {
    if (index >= 3) {
        return COLORS[3];
    }
    return COLORS[index];
};

const CustomBar = (props) => {
    const {
        fill,
        x,
        y,
        width,
        height
    } = props;
    const newProps = {
      x,
      y,
      height,
      fill: colorFetcher(props.index),
      width: props.width * 0.75
    };
    return (<Rectangle {...newProps} />);
};
const truncateOnWord = (str, limit = 10) => {
        var trimmable = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
        var reg = new RegExp('(?=[' + trimmable + '])');
        var words = str.split(reg);
        var count = 0;
        const result = words.filter(function(word) {
            count += word.length;
            return count <= limit;
        }).join('');
        if(result !== str)
          return `${result}...`;
        return result;
}

class BarChart extends React.Component {

    handleClick(e){
      console.log(e);
    }
    render() {

        const { data, x, y, width } = this.props;
        const formatter = (props) => {
            const newProps = {
                ...props,
                content: null,
                x: (width||300) -50,
                y: props.y + (props.height / 2)
            }
            return <text
                  	{...newProps}
                    style={{fontFamily: 'Lato',
                  fontSize: '1em',
                  fontWeight: '300',
                  lineHeight: '3.8',
                  letterSpacing: '-0.3px',
                  textAlign: 'left',
                  color: '#888888'}}
                  >{props.display}</text>;
        }
        const total = data.reduce((p, c) => {
          return p + c[x]
        }, 0);
        const values = [...data].sort((a, b) => a[x] < b[x]).map((item) => {
          return {
            ...item,
            display: `${parseInt(item[x] * 100 / total)}% (${item[x]})`,
            y: Case.sentence(item[y]),
            text: Case.sentence(truncateOnWord(item['text']))
          }
        })
        return (
            <BChart
              width={width || 300}
              height={50 * values.length}
    			data={values}
          barGap={"10%"}
    			layout="vertical">
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey={y} tickLine={false} />
          <Bar dataKey={x} shape={<CustomBar/>} maxBarSize={40}>
          	 <LabelList fill="#888888" dataKey={x} content={formatter}  position="right" />
          </Bar>
        </BChart>
        );
    }
}

export default BarChart;
