import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, sortBy, onSortChange }) => {
  const sortOptions = [
    { id: 'name', label: 'Nom (A-Z)' },
    { id: 'stock-low', label: 'Stock ↑' },
    { id: 'stock-high', label: 'Stock ↓' },
    { id: 'date-new', label: 'Récent' },
    { id: 'date-old', label: 'Ancien' }
  ];

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        {/* Search Input */}
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un produit..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button className="search-clear" onClick={onClear}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="sort-dropdown-inline">
          <ArrowUpDown size={16} className="sort-icon" />
          <select 
            className="sort-select-inline"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;