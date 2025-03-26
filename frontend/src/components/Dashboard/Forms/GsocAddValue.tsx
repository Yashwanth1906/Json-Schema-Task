import React from 'react';
import { GsocAddForm } from '../../types';

interface GsocAddValueProps {
  formData: GsocAddForm;
  onChange: (data: GsocAddForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const GsocAddValue: React.FC<GsocAddValueProps> = ({
  formData,
  onChange,
  onSubmit,
  loading
}) => {
  return (
    <div className="operation-form">
      <h2>Add GSOC Record</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onChange({...formData, username: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Certificate Status:</label>
          <select
            value={formData.isCertificateIssued}
            onChange={(e) => onChange({...formData, isCertificateIssued: e.target.value})}
            required
          >
            <option value="NO">No</option>
            <option value="YES">Yes</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          Add Record
        </button>
      </form>
    </div>
  );
};

export default GsocAddValue; 