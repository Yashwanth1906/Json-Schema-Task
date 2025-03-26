import React from 'react';
import { GsocUpdateForm } from '../../types';

interface GsocUpdateValueProps {
  formData: GsocUpdateForm;
  onChange: (data: GsocUpdateForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const GsocUpdateValue: React.FC<GsocUpdateValueProps> = ({
  formData,
  onChange,
  onSubmit,
  loading
}) => {
  return (
    <div className="operation-form">
      <h2>Update GSOC Record</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email to Update:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Update Type:</label>
          <select
            value={formData.updateType}
            onChange={(e) => onChange({...formData, updateType: e.target.value as 'username' | 'certificate'})}
            required
          >
            <option value="username">Username</option>
            <option value="certificate">Certificate Status</option>
          </select>
        </div>
        {formData.updateType === 'username' ? (
          <div className="form-group">
            <label>New Username:</label>
            <input
              type="text"
              value={formData.newValue}
              onChange={(e) => onChange({...formData, newValue: e.target.value})}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>New Certificate Status:</label>
            <select
              value={formData.newValue}
              onChange={(e) => onChange({...formData, newValue: e.target.value})}
              required
            >
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>
        )}
        <button type="submit" disabled={loading}>
          Update Record
        </button>
      </form>
    </div>
  );
};

export default GsocUpdateValue; 