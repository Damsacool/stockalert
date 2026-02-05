import React from "react";
import { Package, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";

const AnalyticsSummary = ({ products }) => {
    const totalProducts = products.length;
    const lowStockCount = products.filter(
        p => p.stock <= p.minStock
    ).length;

    const totalStock = products.reduce(
        (sum, p) => sum + p.stock, 0
    );

    // To find product with most stock
    const mostStocked = products.length > 0
    ? products.reduce((max, p) => p.stock > max.stock ? p : max, products[0])
    : null;

    return (
        <div className="analytics-summary">
            {/*Total product*/}
            <div className="stat-card">
                <div className="stat-icon" style={{ background: '#dbeafe' }}>
                    <Package size={24}  color="#2563eb" />
                </div>

                <div className="stat-content">
                    <p className="stat-label">Total Produits</p>
                    <p className="stat-value">{totalProducts}</p>
                </div>
            </div>

            {/*Total stock*/}
            <div className="stat-card">
                <div className="stat-icon" style={{ background: '#eoe7ff' }}>
                    <BarChart3 size={24} color='#6366f1' />
                </div>

                <div className="stat-content">
                    <p className="stat-label">Article en Stock</p>
                    <p className="stat-value">{totalStock}</p>
                </div>
            </div>

            {/*Low stock alerts*/}
            <div className="stat-card alert-card">
                <div className="stat-icon" style={{ background: '#feefe2' }}>
                    <AlertTriangle size={24} color='#dc2626' />
                </div>

                <div className="stat-content">
                    <p className="stat-label">Stock Bas</p>
                    <p className="stat-value">{lowStockCount}</p>
                </div>
            </div>

            {/* Most Stocked Product*/}
            <div className="start-card highlight-card">
                <div className="stat-icon" style={{ background: '#d1fae5' }}>
                    <TrendingUp size={24} color='#059669' />
                </div>

                <div className="stat-content">
                    <p className="stat-label">Plus en Stock</p>
                    <p className="stat-value-name">{mostStocked ? mostStocked.name : 'N/A'}</p>
                    <p className="stat-subvalue">{mostStocked ? `${mostStocked.stock} unités` : ''}</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSummary;