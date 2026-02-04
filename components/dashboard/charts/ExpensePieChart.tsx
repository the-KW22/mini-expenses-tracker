'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatAmount } from '@/lib/utils/index';

interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
  icon?: string;
}

interface ExpensePieChartProps {
  categoryExpenses: CategoryExpense[];
  totalExpenses: number;
}

export default function ExpensePieChart({
  categoryExpenses,
  totalExpenses,
}: ExpensePieChartProps) {
  // Fallback colors using theme chart colors
  const FALLBACK_COLORS = ['#A1C1A1', '#8BA995', '#D2C4B2', '#A5BED4', '#E8D5A3'];

  const data = categoryExpenses.map((cat, index) => ({
    name: cat.categoryName,
    value: cat.total,
    color: cat.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  }));

  if (categoryExpenses.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No expenses recorded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatAmount(value as number)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
          <p className="text-2xl font-bold">{formatAmount(totalExpenses)}</p>
          <p className="text-sm text-muted-foreground">Total Expenses</p>
        </div>
      </CardContent>
    </Card>
  );
}
