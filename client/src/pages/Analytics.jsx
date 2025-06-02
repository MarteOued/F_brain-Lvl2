import { useState, useEffect } from 'react';
import {
  PieChart, Pie, BarChart, Bar, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { toast } from 'react-toastify';

const CHART_COLORS = {
  food: '#EF4444',
  transport: '#3B82F6',
  leisure: '#10B981',
  other: '#F59E0B',
  budget: '#94A3B8',
  positive: '#10B981',
  negative: '#EF4444',
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [chartData, setChartData] = useState({
    pieData: [],
    barData: [],
  });

  useEffect(() => {
    const fetchData = () => {
      try {
        const pieData = [
          { name: 'Alimentaire', value: 45, color: CHART_COLORS.food },
          { name: 'Transport', value: 30, color: CHART_COLORS.transport },
          { name: 'Loisirs', value: 15, color: CHART_COLORS.leisure },
          { name: 'Autres', value: 10, color: CHART_COLORS.other },
        ];

        const barData = [
          { name: 'Jan', depenses: 1200, budget: 1500 },
          { name: 'Fév', depenses: 900, budget: 1500 },
          { name: 'Mar', depenses: 1400, budget: 1500 },
          { name: 'Avr', depenses: 1100, budget: 1500 },
          { name: 'Mai', depenses: 1600, budget: 1500 },
        ];

        setChartData({ pieData, barData });
      } catch (error) {
        toast.error('Erreur de chargement des données');
        console.error(error);
      }
    };

    fetchData();
  }, [timeRange]);

  const totalExpenses = chartData.barData.reduce((sum, item) => sum + item.depenses, 0);
  const totalBudget = chartData.barData.reduce((sum, item) => sum + item.budget, 0);
  const savings = totalBudget - totalExpenses;

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <header className="analytics-header">
          <h1 className="analytics-title">Analytiques Financières</h1>
          <div className="time-range-selector">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'active' : ''}
              >
                {range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </header>

        <div className="stats-grid">
          <StatCard
            title="Dépenses Totales"
            value={`${totalExpenses.toFixed(2)} €`}
            change="+12% vs mois dernier"
            isPositive={false}
          />
          <StatCard
            title="Budget Restant"
            value={`${Math.max(0, totalBudget - totalExpenses).toFixed(2)} €`}
            change="+5% vs mois dernier"
            isPositive={totalBudget > totalExpenses}
          />
          <StatCard
            title="Économies"
            value={`${savings > 0 ? savings.toFixed(2) : '0.00'} €`}
            change={savings > 0 ? "+8% vs mois dernier" : "Dépassement de budget"}
            isPositive={savings > 0}
          />
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h2>Répartition par Catégorie</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} €`, 'Montant']} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Dépenses Mensuelles</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData.barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="depenses"
                  fill={CHART_COLORS.transport}
                  name="Dépenses"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="budget"
                  fill={CHART_COLORS.budget}
                  name="Budget"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-page {
          min-height: 100vh;
          width: 100%;
          background: #f8fafc;
          padding: 2rem;
          display: flex;
          justify-content: center;
        }

        .analytics-container {
          flex: 1;
          max-width: 1600px;
          width: 100%;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .analytics-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e40af;
        }

        .time-range-selector {
          display: flex;
          gap: 0.5rem;
          background: #e2e8f0;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .time-range-selector button {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 0.25rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .time-range-selector button.active {
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .charts-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1200px) {
          .charts-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .chart-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .chart-card h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ title, value, change, isPositive }) => (
  <div className="stat-card">
    <h3 className="stat-title">{title}</h3>
    <p className="stat-value">{value}</p>
    <p className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
      {change}
    </p>

    <style jsx>{`
      .stat-card {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }

      .stat-title {
        font-size: 1rem;
        color: #64748b;
        margin-bottom: 0.5rem;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0.5rem 0;
      }

      .stat-change {
        font-size: 0.875rem;
        font-weight: 500;
      }

      .stat-change.positive {
        color: #10b981;
      }

      .stat-change.negative {
        color: #ef4444;
      }
    `}</style>
  </div>
);
