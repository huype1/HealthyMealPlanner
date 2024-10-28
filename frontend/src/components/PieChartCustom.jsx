import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const PieChartComponent = ({ protein, fat, carb, size }) => {
  const calculatePercentage = (value, total) => {
    return Math.round((value / total) * 100);
  };

  const total = protein + fat + carb;
  const data = [
    { name: `Protein`, value: calculatePercentage(protein, total) },
    { name: `Carbs`, value: calculatePercentage(carb, total) },
    { name: `Fat`, value: calculatePercentage(fat, total) },
  ];

  const COLORS = ['#9B59B6', '#F1C40F', '#3498DB'];

  return (
    <PieChart width={size} height={size}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default PieChartComponent;