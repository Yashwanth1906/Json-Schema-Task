import React from 'react';
import { DeleteForm as DeleteFormType } from '../../types';

interface DeleteFormProps {
  formData: DeleteFormType;
  onChange: (data: DeleteFormType) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const DeleteForm: React.FC<DeleteFormProps> = ({
  formData,
  onChange,
  onSubmit,
  loading
}) => {
  return (
    <div className="operation-form">
      <h2>Delete Value</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Content to Delete:</label>
          <input
            type="text"
            value={formData.contentToDelete}
            onChange={(e) => onChange({...formData, contentToDelete: e.target.value})}
            required
          />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.deleteAllOccurance}
              onChange={(e) => onChange({...formData, deleteAllOccurance: e.target.checked})}
            />
            Delete all occurrences
          </label>
        </div>
        <button type="submit" disabled={loading}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default DeleteForm; 