import React from 'react';
import { Grid, AlertTriangle, CheckCircle }  from 'lucide-react'

const FilterButtons = ({ activeFilter, onChange, counts }) => {
    const filters = [
        { id: 'all', label: 'Tous', icon: Grid, count: counts.all },
        { id: 'low-stock', label: 'Stock Bas', icon: AlertTriangle, count: counts.lowStock },
        { id: 'normal', label: 'Normal', icon: CheckCircle, count: counts.normal }
    ];

    return (
        <div className='filter-buttons'>
            {filters.map(filters => {
                const Icon = filters.icon;
                return (
                    <button 
                    key={filters.id}
                    className={`filter-btn ${activeFilter === filters.id ? 'active': ''}`}
                    onClick={() => onChange(filters.id)}
                    >
                        <Icon size={18} />
                        <span>{filters.label}</span>
                        <span className='filter-count'>{filters.count}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default FilterButtons;