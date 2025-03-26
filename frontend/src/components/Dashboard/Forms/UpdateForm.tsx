import React from 'react';
import { UpdateForm as UpdateFormType } from '../../types';

interface UpdateFormProps {
  formData: UpdateFormType;
  onChange: (data: UpdateFormType) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  formData,
  onChange,
  onSubmit,
  loading
}) => {
  return (
    <div className="operation-form">
      <h2>Update Values</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Value to Update:</label>
          <input
            type="text"
            value={formData.valueToUpdate}
            onChange={(e) => onChange({...formData, valueToUpdate: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>New Value:</label>
          <input
            type="text"
            value={formData.newValue}
            onChange={(e) => onChange({...formData, newValue: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.replaceAll}
              onChange={(e) => onChange({...formData, replaceAll: e.target.checked})}
            />
            Replace all occurrences
          </label>
        </div>
        <button type="submit" disabled={loading}>
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateForm; 