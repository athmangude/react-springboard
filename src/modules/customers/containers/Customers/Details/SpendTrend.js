import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class SpendTrend extends Component {
  state = {
    data: [
      { period: 'Jan', amount: 2400 },
      { period: 'Feb', amount: 1210 },
      { period: 'Mar', amount: 2290 },
      { period: 'Apr', amount: 200 },
      { period: 'May', amount: 581 },
      { period: 'Jun', amount: 2500 },
      { period: 'Jul', amount: 1100 },
    ],
  };

  render() {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ height: 30, fontSize: 13, fontWeight: 900, color: '#6d6e71' }}>Total amount spent (1 Jan 2018 - 31 Jul 2018)</div>
          <div style={{ textTransform: 'uppercase', fontSize: 11, color: '#2574a6', cursor: 'pointer' }}>Edit Details</div>
        </div>
        <div style={{ width: '100%', height: 340, borderRadius: 5, border: 'solid 1px #e2e4eb', padding: '40px 30px 20px 0' }}>
          <ResponsiveContainer>
            <LineChart width={600} height={300} data={this.state.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="period" tickLine={false} />
              <YAxis tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line dataKey="amount" stroke="#52bf8a" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
