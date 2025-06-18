import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type PublisherChartData = { publisher: string; review_count: number; avg_score: number;}

const PublisherChart: React.FC<{data: PublisherChartData[]}> = ({ data }) => (
  <ResponsiveContainer width="100%" height={400} >
    <ComposedChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 60 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
      <XAxis
        dataKey="publisher"
        angle={-35}
        textAnchor="end"
        interval={0}
        tick={{ fill: '#ccc', fontSize: 12 }}
      />
      <YAxis
        yAxisId="left"
        label={{ value: 'Liczba recenzji', angle: -90, position: 'insideLeft' }}
        tick={{ fill: '#ccc' }}
      />
      <YAxis
        yAxisId="right"
        orientation="right"
        domain={[0.95, 1]}
        tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
        label={{ value: 'Średnia ocen (%)', angle: -90, position: 'insideRight', dx: 25 }}
        tick={{ fill: '#ffa500' }}
      />
      <Tooltip
        formatter={(value, name) =>
          name === 'Średnia ocen' ? `${(Number(value) * 100).toFixed(2)}%` : value
        }
      />
      <Legend
        layout="horizontal"
        verticalAlign="bottom"
        align="center"
        wrapperStyle={{ paddingTop: 45 }}
      />
      <Bar
        yAxisId="left"
        dataKey="review_count"
        name="Liczba recenzji"
        fill="#8884d8"
        barSize={20}
        offset={10}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="avg_score"
        name="Średnia ocen"
        stroke="#ffa500"
        strokeWidth={2}
        dot={{ r: 4, stroke: '#fff', strokeWidth: 1 }}
      />
    </ComposedChart>
  </ResponsiveContainer>

);

export default PublisherChart;
