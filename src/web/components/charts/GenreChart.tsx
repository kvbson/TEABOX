import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export type GenreChartData = { genre: string; review_count: number;}

const GenreChart: React.FC<{data: GenreChartData[]}> = ({ data }) => (
  <ResponsiveContainer width="80%" height={400} >
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
        label={{ value: 'Liczba recenzji', angle: -90, position: 'insideLeft', dx: -20 }}
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
        name="Liczba recenzji"
        fill="#8884d8"
        barSize={30}
        offset={10}
      />
    </ComposedChart>
  </ResponsiveContainer>

);

export default GenreChart;
