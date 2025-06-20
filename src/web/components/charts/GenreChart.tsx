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

export type GenreChartData = { genre: string; review_count: number;}

const GenreChart: React.FC<{data: GenreChartData[]}> = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <ComposedChart
      data={data}
      margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
      barCategoryGap="10%"
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
      <XAxis
        dataKey="genre"
        angle={-35}
        textAnchor="end"
        tick={{ fill: '#ccc', fontSize: 12 }}
      />
      <YAxis
        yAxisId="left"
        label={{ value: "Review's count", angle: -90, position: 'insideLeft', dx: -20 }}
        tick={{ fill: '#ccc' }}
      />
      <YAxis yAxisId="right" />
      <Tooltip />
      <Legend
        layout="horizontal"
        verticalAlign="bottom"
        align="center"
        wrapperStyle={{ paddingTop: 35 }}
      />
      <Bar
        yAxisId="left"
        dataKey="review_count"
        name="Review's count"
        fill="#8884d8"
        barSize={30}
        offset={10}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="avg_score"
        name="AVG"
        stroke="#ffa500"
        strokeWidth={2}
        dot={{ r: 4, stroke: '#fff', strokeWidth: 1 }}
      />
    </ComposedChart>
  </ResponsiveContainer>

);

export default GenreChart;
