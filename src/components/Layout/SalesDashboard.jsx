import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award, DollarSign } from 'lucide-react';     
import { getAllTransactions } from '../../utils/db';

const SalesDashboard = ({ products }) => {
    const [transactions, setTransactions] = useState([]);
    const [timeFilter, setTimeFilter] = useState('today');

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const transactions = await getAllTransactions();
            setTransactions(transactions);
        } catch (error) {
            console.error('Failed to load transaction:', error);
        }
    };
    
    // Filter transaction by time
    const getFilteredTransactions = () => {
        const now = new Date();
        const  today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return transactions.filter (t => {
            const txDate = new Date(t.date);
            if (timeFilter === 'today') return txDate >= today;
            if (timeFilter === 'week') return txDate >= weekAgo;
            if (timeFilter === 'month') return txDate >= monthAgo;
            return true;
        });
    };

    const filteredTransactions = getFilteredTransactions();

    // Calculate stats
    const totalSales =  filteredTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);

    const totalRevenue = filteredTransactions.reduce((sum, t) => {
        const product = products.find(p => p.id === t.productId);
        return sum + ((t.quantity || 0) * (product?.sellingPrice || 0));
    }, 0);

    // Best sellers
    const salesByProduct = {};
    filteredTransactions.forEach(t => {
        if (!salesByProduct[t.productId]) {
            salesByProduct[t.productId] = {
                productName: t.productName,
                quantity: 0,
                revenue: 0
            };
        }

        salesByProduct[t.productId].quantity += t.quantity;

        const product = products.find(p => p.id === t.productId);
        salesByProduct[t.productId].revenue += t.quantity * (product?.sellingPrice || 0)
    });

    const bestSellers = Object.values(salesByProduct)
    .sort((a, b) => b.quantity - a.quantity)
    .slice (0, 5);

    if (transactions.length === 0) {
        return (
            <div className='sales-dashboard'>
                <div className='no-sales'>
                    <TrendingUp size={48} color='#9ca3af' />
                    <p>Aucune vente enregistrée</p>
                    <p className='no-sales-hint'>Les ventes seront trackées automatiquement</p>
                </div>
            </div>
        );
    }

    return (
        <div className='sales-dashboard'>
            <div className='sales-header'>
                <h2>Tableau des Ventes</h2>

                    <div className='time-filters'>
                        <button
                        className={`time-filter-btn ${timeFilter === 'today' ? 'active': ''}`}
                        onClick={() => setTimeFilter('today')}
                        >
                            Aujourd'hui
                        </button>
                        <button
                        className={`time-filter-btn ${timeFilter === 'week' ? 'active': ''}`}
                        onClick={() => setTimeFilter('week')}
                        >
                            7 jours
                        </button>
                        <button
                        className={`time-filter-btn ${timeFilter === 'month' ? 'active': ''}`}
                        onClick={() => setTimeFilter('month')}
                        >
                            30 jours
                        </button>
                    </div>
                </div>

                <div className='sales-stats'>
                    <div className='sales-stat-card'>
                        <TrendingUp size={24} color='#10b981' />
                        <div>
                            <p className='stat-value'>{totalSales}</p>
                            <p className='stat-label'>Articles Vendues</p>
                        </div>
                    </div>

                    <div className='sales-stat-card'>
                        <DollarSign size={24} color='#6366f1' />
                        <div>
                            <p className='stat-value'>{totalRevenue.toLocaleString()} CFA</p>
                            <p className='stat-label'>Revenu Total</p>
                        </div>
                    </div>

                    <div className='sales-stat-card'>
                        <Calendar size={24} color='#f59e0b' />
                        <div>
                            <p className='stat-label'>{filteredTransactions.length}</p>
                            <p className='stat-value'>Transactions</p>
                        </div>
                    </div>
                </div>

                {bestSellers.length > 0 && (
                    <div className='best-sellers'>
                        <h3><Award size={20} />Top ventes</h3>
                        <div className='best-sellers-list'>
                            {bestSellers.map((sellers, index) => (
                                <div key={index} className='best-seller-item'>
                                    <div className='seller-rank'>#{index + 0}</div>
                                    <div className='seller-info'>
                                        <p className='seller-name'>{sellers.productName}</p>
                                        <p className='seller-stats'>
                                            {sellers.quantity} Vendus • {sellers.revenue.toLocaleString()} CFA
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
     );

};

export default SalesDashboard;