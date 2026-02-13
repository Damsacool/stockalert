import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';
import { getAllTransactions } from '../../utils/db';

const SalesChart = ({ products }) => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('daily'); 
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    loadChartData();
  }, [chartType, timeRange, products]);

  const loadChartData = async () => {
    try {
      const transactions = await getAllTransactions();
      
      if (chartType === 'daily') {
        generateDailyChart(transactions);
      } else {
        generateProductChart(transactions);
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  };

  const generateDailyChart = (transactions) => {
    const days = timeRange === 'week' ? 7 : 30;
    const now = new Date();
    const data = [];

    // Generate last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        tDate.setHours(0, 0, 0, 0);
        return tDate.getTime() === date.getTime();
      });

      const totalSales = dayTransactions.reduce((sum, t) => sum + t.quantity, 0);
      const revenue = dayTransactions.reduce((sum, t) => {
        const product = products.find(p => p.id === t.productId);
        return sum + (t.quantity * (product?.sellingPrice || 0));
      }, 0);

      data.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        sales: totalSales,
        revenue: Math.round(revenue)
      });
    }

    setChartData(data);
  };

  const generateProductChart = (transactions) => {
    const salesByProduct = {};

    transactions.forEach(t => {
      if (!salesByProduct[t.productId]) {
        salesByProduct[t.productId] = {
          name: t.productName,
          quantity: 0,
          revenue: 0
        };
      }
      salesByProduct[t.productId].quantity += t.quantity;

      const product = products.find(p => p.id === t.productId);
      salesByProduct[t.productId].revenue += t.quantity * (product?.sellingPrice || 0);
    });

    const data = Object.values(salesByProduct)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5) 
      .map(item => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        quantity: item.quantity,
        revenue: Math.round(item.revenue)
      }));

    setChartData(data);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{payload[0].payload.date || payload[0].payload.name}</p>
        {chartType === 'daily' ? (
          <>
            <p className="tooltip-value">
              <TrendingUp size={14} />
              Ventes: <strong>{payload[0].value}</strong>
            </p>
            <p className="tooltip-value">
              <DollarSign size={14} />
              Revenu: <strong>{payload[1]?.value.toLocaleString()} CFA</strong>
            </p>
          </>
        ) : (
          <>
            <p className="tooltip-value">
              <TrendingUp size={14} />
              Vendus: <strong>{payload[0].value}</strong>
            </p>
            <p className="tooltip-value">
              <DollarSign size={14} />
              Revenu: <strong>{payload[1]?.value.toLocaleString()} CFA</strong>
            </p>
          </>
        )}
      </div>
    );
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  if (chartData.length === 0) {
    return (
      <div className="sales-chart">
        <div className="no-chart-data">
          <BarChart size={48} color="#9ca3af" />
          <p>Pas assez de données pour les graphiques</p>
          <p className="no-chart-hint">Effectuez quelques ventes pour voir les tendances</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-chart">
      <div className="chart-header">
        <h2>Tendances & Analyses</h2>

        <div className="chart-controls">
          {/* Chart Type Toggle */}
          <div className="chart-type-buttons">
            <button
              className={`chart-type-btn ${chartType === 'daily' ? 'active' : ''}`}
              onClick={() => setChartType('daily')}
            >
              Tendances
            </button>
            <button
              className={`chart-type-btn ${chartType === 'products' ? 'active' : ''}`}
              onClick={() => setChartType('products')}
            >
              Top Produits
            </button>
          </div>

          {/* Time Range (only for daily) */}
          {chartType === 'daily' && (
            <div className="time-range-buttons">
              <button
                className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
                onClick={() => setTimeRange('week')}
              >
                7j
              </button>
              <button
                className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
                onClick={() => setTimeRange('month')}
              >
                30j
              </button>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey={chartType === 'daily' ? 'date' : 'name'} 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          {chartType === 'daily' ? (
            <>
              <Bar dataKey="sales" fill="#667eea" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </>
          ) : (
            <>
              <Bar dataKey="quantity" fill="#667eea" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.6} />
                ))}
              </Bar>
            </>
          )}
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        {chartType === 'daily' ? (
          <>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#667eea' }}></span>
              <span>Articles Vendus</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#10b981' }}></span>
              <span>Revenu (CFA)</span>
            </div>
          </>
        ) : (
          <>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#667eea' }}></span>
              <span>Quantité Vendue</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#10b981' }}></span>
              <span>Revenu (CFA)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesChart;