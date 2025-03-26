import React from 'react';
import { WriteOption } from './types';

interface WriteOptionsProps {
  onSelect: (option: WriteOption) => void;
}

const WriteOptions: React.FC<WriteOptionsProps> = ({ onSelect }) => {
  return (
    <div className="modify-form">
      <h2>Select Write Option</h2>
      <div className="button-group">
        <button onClick={() => onSelect('normal')}>
          Write Normal Content
        </button>
        <button onClick={() => onSelect('gsoc')}>
          Write GSOC Project Format
        </button>
      </div>
    </div>
  );
};

export default WriteOptions; 