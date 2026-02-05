import React from 'react';

const BulkEditModal = ({ 
  show, 
  onClose, 
  product, 
  bulkType, 
  bulkAmount, 
  setBulkAmount, 
  onSubmit 
}) => {
  if (!show || !product) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content modal-small' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>{bulkType === 'increase' ? 'Reçu Stock' : 'Vendre Stock'}</h2>
          <button className='modal-close' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='modal-body'>
          <p className='modal-product-name'>{product.name}</p>
          <p className='modal-stock-info'>
            Stock actuel: <strong>{product.stock}</strong>
          </p>

          <input
            type='number'
            className='form-input form-input-large'
            placeholder='Quantité'
            value={bulkAmount}
            onChange={(e) => setBulkAmount(e.target.value)}
            autoFocus
          />
        </div>

        <div className='modal-footer'>
          <button className='btn-secondary' onClick={onClose}>
            Annuler
          </button>
          <button className='btn-primary' onClick={onSubmit}>
            {bulkType === 'increase' ? 'Ajouter' : 'Retirer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;