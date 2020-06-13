import React, { PureComponent } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend } from "recharts";
const prettyBytes = require('pretty-bytes');

const toolTipStyles = { backgroundColor: "white", padding: "10px" }
const CustomTooltip = ({ active, payload }) => {
  if (!active) return null
  return (
    <div style={toolTipStyles} > {payload[0].payload.name}
      {payload.map((value, index) => {
        return <div style={{ color: `${value.color}` }} key={index}>
          {value.name} : {prettyBytes(value.value)}
        </div>
      })}
    </div>
  )
}

export default class SizeBarChart extends PureComponent {
  render() {
    return (
      <BarChart
        width={500}
        height={300}
        data={this.props.chartData.sizes}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="minified" stackId="a" fill="#8884d8" />
        <Bar dataKey="gzip" stackId="a" fill="#82ca9d" />
      </BarChart>
    );
  }
}
