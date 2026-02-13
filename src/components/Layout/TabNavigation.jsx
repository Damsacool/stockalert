import React from 'react';
import { Package, TrendingUp, Clock, FileText } from 'lucide-react';

const TabNavigation = ({ activeTab, onChange }) => {
    const tabs = [
        {id: 'inventory', label: 'Inventaire', icon: Package},
        {id: 'sales', label: 'Ventes', icon: TrendingUp},
        {id: 'history', label: 'Historique', icon: Clock},
        {id: 'reports', label: 'Rapports', icon: FileText}
    ]                                                                                                                                                                                                                  

    return (
        <div className='tab-navigation'>
            <div className='tab-list'>
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onChange(tab.id)}
                        >
                            <Icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    )
                })}

            </div>

        </div>
    )
}

export default TabNavigation;