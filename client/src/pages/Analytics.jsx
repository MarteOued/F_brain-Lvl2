import { useState, useEffect } from 'react';
import {
  PieChart, Pie, BarChart, Bar, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CHART_COLORS = {
  food: '#FF6B6B',
  transport: '#4ECDC4',
  leisure: '#45B7D1',
  other: '#FFA726',
  budget: '#9C88FF',
  positive: '#00E676',
  negative: '#FF5252',
  gradient1: '#667eea',
  gradient2: '#764ba2',
  gradient3: '#f093fb',
  gradient4: '#f5576c',
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [chartData, setChartData] = useState({
    pieData: [],
    barData: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

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
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error('Erreur de chargement des données', error);
      }
    };

    fetchData();
  }, [timeRange]);

  const totalExpenses = chartData.barData.reduce((sum, item) => sum + item.depenses, 0);
  const totalBudget = chartData.barData.reduce((sum, item) => sum + item.budget, 0);
  const savings = totalBudget - totalExpenses;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name}: {entry.value}€
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-page">
      <div className="floating-orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
        <div className="orb orb4"></div>
      </div>

      <div className="analytics-container">
        <header className={`analytics-header ${isLoaded ? 'loaded' : ''}`}>
          <div className="title-container">
            <h1 className="analytics-title">
              <span className="title-main">Tableau de Bord</span>
              <span className="title-sub">Analytiques Financières</span>
            </h1>
          </div>
          <div className="time-range-selector">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`range-btn ${timeRange === range ? 'active' : ''}`}
              >
                <span>{range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Année'}</span>
              </button>
            ))}
          </div>
        </header>

        <div className={`stats-grid ${isLoaded ? 'loaded' : ''}`}>
          <StatCard
            title="Dépenses Totales"
            value={`${totalExpenses.toFixed(2)} €`}
            change="+12% vs mois dernier"
            isPositive={false}
            icon="💳"
            gradient="gradient1"
          />
          <StatCard
            title="Budget Restant"
            value={`${Math.max(0, totalBudget - totalExpenses).toFixed(2)} €`}
            change="+5% vs mois dernier"
            isPositive={totalBudget > totalExpenses}
            icon="💰"
            gradient="gradient2"
          />
          <StatCard
            title="Économies"
            value={`${savings > 0 ? savings.toFixed(2) : '0.00'} €`}
            change={savings > 0 ? "+8% vs mois dernier" : "Dépassement de budget"}
            isPositive={savings > 0}
            icon="🎯"
            gradient="gradient3"
          />
        </div>

        <div className={`charts-container ${isLoaded ? 'loaded' : ''}`}>
          <div className="chart-card pie-card">
            <div className="chart-header">
              <h2>Répartition par Catégorie</h2>
              <div className="chart-icon">📊</div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <Pie
                  data={chartData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  paddingAngle={8}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {chartData.pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={2}
                      filter="url(#glow)"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card bar-card">
            <div className="chart-header">
              <h2>Évolution Mensuelle</h2>
              <div className="chart-icon">📈</div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData.barData} barGap={10}>
                <defs>
                  <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ECDC4" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#44A08D" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9C88FF" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#8A2BE2" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="depenses"
                  fill="url(#barGradient1)"
                  name="Dépenses"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="budget"
                  fill="url(#barGradient2)"
                  name="Budget"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .analytics-page {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .floating-orbs {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(10px);
          animation: float 20s infinite ease-in-out;
        }

        .orb1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 10%;
          animation-delay: -5s;
        }

        .orb3 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 60%;
          animation-delay: -10s;
        }

        .orb4 {
          width: 100px;
          height: 100px;
          top: 30%;
          right: 30%;
          animation-delay: -15s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(5deg); }
          66% { transform: translateY(20px) rotate(-5deg); }
        }

        .analytics-container {
          position: relative;
          z-index: 2;
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(-30px);
          transition: all 0.8s ease;
        }

        .analytics-header.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .title-container {
          position: relative;
        }

        .analytics-title {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .title-main {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          text-shadow: 0 0 30px rgba(255,255,255,0.3);
        }

        .title-sub {
          font-size: 1.2rem;
          font-weight: 300;
          color: rgba(255,255,255,0.8);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .time-range-selector {
          display: flex;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          padding: 0.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .range-btn {
          padding: 1rem 2rem;
          border: none;
          background: transparent;
          border-radius: 15px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          color: rgba(255,255,255,0.8);
          position: relative;
          overflow: hidden;
        }

        .range-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .range-btn:hover::before {
          left: 100%;
        }

        .range-btn.active {
          background: rgba(255,255,255,0.2);
          color: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 0.2s;
        }

        .stats-grid.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .charts-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 0.4s;
        }

        .charts-container.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        @media (min-width: 1200px) {
          .charts-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .chart-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 2.5rem;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .chart-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        }

        .chart-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.4);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .chart-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 0 20px rgba(255,255,255,0.3);
        }

        .chart-icon {
          font-size: 2rem;
          opacity: 0.7;
        }

        .custom-tooltip {
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }

        .tooltip-label {
          color: white;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .tooltip-value {
          font-size: 0.9rem;
          margin: 0.2rem 0;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .analytics-container {
            padding: 1rem;
          }
          
          .title-main {
            font-size: 2.5rem;
          }
          
          .analytics-header {
            flex-direction: column;
            text-align: center;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .chart-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

const StatCard = ({ title, value, change, isPositive, icon, gradient }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const gradients = {
    gradient1: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
    gradient2: 'linear-gradient(135deg, #4ECDC4, #44A08D)', 
    gradient3: 'linear-gradient(135deg, #9C88FF, #8A2BE2)',
  };

  return (
    <div 
      className={`stat-card ${gradient}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="stat-card-inner">
        <div className="stat-header">
          <div className="stat-icon">{icon}</div>
          <h3 className="stat-title">{title}</h3>
        </div>
        <p className="stat-value">{value}</p>
        <div className="stat-footer">
          <p className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
            <span className="change-indicator">{isPositive ? '↗' : '↘'}</span>
            {change}
          </p>
        </div>
        <div className="stat-glow"></div>
      </div>

      <style>{`
        .stat-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 0;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.4);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${gradients[gradient] || gradients.gradient1};
          opacity: 0.1;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover::before {
          opacity: 0.2;
        }

        .stat-card-inner {
          position: relative;
          z-index: 2;
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
        }

        .stat-title {
          font-size: 1rem;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 2.8rem;
          font-weight: 800;
          color: white;
          margin: 1rem 0;
          text-shadow: 0 0 20px rgba(255,255,255,0.3);
          line-height: 1;
        }

        .stat-footer {
          margin-top: auto;
        }

        .stat-change {
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .change-indicator {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .stat-change.positive {
          color: #00E676;
          text-shadow: 0 0 10px rgba(0,230,118,0.3);
        }

        .stat-change.negative {
          color: #FF5252;
          text-shadow: 0 0 10px rgba(255,82,82,0.3);
        }

        .stat-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .stat-card:hover .stat-glow {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};