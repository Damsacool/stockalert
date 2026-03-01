import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AddWorkerModal = ({ show, onClose, onWorkerAdded }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signUpError } = await signUp(
      formData.email,
      formData.password,
      formData.fullName,
      'worker'
    );

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setFormData({ email: '', password: '', fullName: '' });
    setLoading(false);
    onWorkerAdded();
    alert(`Travailleur ajouté: ${formData.fullName}\nEmail: ${formData.email}\nMot de passe: ${formData.password}\n\nPartagez ces informations avec le travailleur.`);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <UserPlus size={24} />
            Ajouter un travailleur
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Ex: Jean Kouassi"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 caractères"
              required
              minLength={6}
              disabled={loading}
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Le travailleur utilisera cet email et ce mot de passe pour se connecter
            </small>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Ajout...' : 'Ajouter travailleur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkerModal;