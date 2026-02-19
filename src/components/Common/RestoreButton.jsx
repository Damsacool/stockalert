import React, { useState } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { restoreFromSupabase } from '../../utils/db';

const RestoreButton = ({ onRestoreComplete }) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    
    const result = await restoreFromSupabase();
    
    setIsRestoring(false);
    setShowConfirm(false);
    
    if (result.success) {
      alert(`Restauré avec succès!\n\n${result.productsCount} produits\n${result.transactionsCount} transactions`);
      if (onRestoreComplete) onRestoreComplete();
      window.location.reload(); 
    } else {
      alert(`Erreur de restauration:\n${result.error}`);
    }
  };

  if (showConfirm) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '400px',
          margin: '20px'
        }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <AlertCircle size={24} color="#f59e0b" />
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Restaurer depuis le cloud?</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                Cela remplacera toutes les données locales par les données du cloud.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleRestore}
              disabled={isRestoring}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: isRestoring ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: isRestoring ? 0.6 : 1
              }}
            >
              {isRestoring ? 'Restauration...' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
      }}
    >
      <Download size={18} />
      <span>Restaurer du Cloud</span>
    </button>
  );
};

export default RestoreButton;