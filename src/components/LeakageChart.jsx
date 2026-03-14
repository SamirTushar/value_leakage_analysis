import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCr } from '../utils/formatCurrency';

const COLORS = ['#0F766E', '#14B8A6', '#2DD4BF', '#5EEAD4'];

export default function LeakageChart({ gaps }) {
  const data = gaps
    .filter(g => g.value != null && g.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((g) => ({
      name: g.name,
      value: Number(g.value.toFixed(1)),
    }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Gap Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
          <XAxis type="number" tickFormatter={(v) => `₹${v}`} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={160} />
          <Tooltip
            formatter={(value) => [formatCr(value), 'Amount']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
