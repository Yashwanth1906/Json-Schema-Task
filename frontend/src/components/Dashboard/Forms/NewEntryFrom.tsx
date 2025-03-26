import React from 'react';
import { NewEntryForm as NewEntryFormType } from '../../types';

interface NewEntryFormProps {
  formData: NewEntryFormType;
  onChange: (data: NewEntryFormType) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({
  formData,
  onChange,
  onSubmit,
  loading
}) => {
  return (
    <div className="operation-form">
      <h2>Add New Entry</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Content:</label>
          <input
            type="text"
            value={formData.content}
            onChange={(e) => onChange({...formData, content: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Add Entry:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="addPosition"
                value="start"
                checked={formData.position === 'start'}  
                onChange={(e) => onChange({...formData, position: e.target.value as 'start' | 'end'})}
              />
              At the start of the file
            </label>
            <label>
              <input
                type="radio"
                name="addPosition"
                value="end"
                checked={formData.position === 'end'}
                onChange={(e) => onChange({...formData, position: e.target.value as 'start' | 'end'})}
              />
              At the end of the file
            </label>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          Add Record
        </button>
      </form>
    </div>
  );
};

export default NewEntryForm; 