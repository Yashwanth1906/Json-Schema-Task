import React from 'react';
import { GsocDeleteForm } from '../../types';

interface GsocDeleteValueProps {
  formData: GsocDeleteForm;
  onChange: (data: GsocDeleteForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const GsocDeleteValue: React.FC<GsocDeleteValueProps> = ({
  formData,
  onChange,
  onSubmit,
  loading
}) => {
  return (
    <div className="operation-form">
      <h2>Delete GSOC Record</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email to Delete:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange({...formData, email: e.target.value})}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          Delete Record
        </button>
      </form>
    </div>
  );
};

export default GsocDeleteValue; 