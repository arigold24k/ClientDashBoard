import React from 'react';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';

function SimpleLineChart(passData) {
    const data = [];
    const formatter = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    for (let i = 0; i < passData.passData.length; i++) {
      data.push(passData.passData[i]);
    }

    // console.log('passdata that is being passed, ', passData);
    return (
        // 99% per https://github.com/recharts/recharts/issues/172

        <ResponsiveContainer width="99%" height={480}>
            <LineChart data={data}>
                <XAxis dataKey="name" />
                {/*<YAxis formatter = {(value) => new Intl.NumberFormat('en').format(value)}/>*/}
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Consumed" stroke="#82ca9d" formatter = {(value) => new Intl.NumberFormat('en').format(value)}/>
                <Line type="monotone" dataKey="Received" stroke="#8884d8" activeDot={{ r: 8 }} formatter = {(value) => new Intl.NumberFormat('en').format(value)}/>
            </LineChart>
        </ResponsiveContainer>

    );
}

export default SimpleLineChart;