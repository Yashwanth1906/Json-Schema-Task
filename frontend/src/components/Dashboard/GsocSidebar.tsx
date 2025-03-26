import React from 'react';
import { GsocDashboardOption } from '../types';

interface GsocSidebarProps {
  onOptionSelect: (option: GsocDashboardOption) => void;
  activeOption: GsocDashboardOption;
}

const GsocSidebar: React.FC<GsocSidebarProps> = ({ onOptionSelect, activeOption }) => {
  return (
    <div className="sidebar">
      <h3>GSOC Operations</h3>
      <button 
        onClick={() => onOptionSelect('initTable')}
        className={activeOption === 'initTable' ? 'active' : ''}
      >
        Initialize Table
      </button>
      <button 
        onClick={() => onOptionSelect('addValue')}
        className={activeOption === 'addValue' ? 'active' : ''}
      >
        Add Values
      </button>
      <button 
        onClick={() => onOptionSelect('updateValue')}
        className={activeOption === 'updateValue' ? 'active' : ''}
      >
        Update Values
      </button>
      <button 
        onClick={() => onOptionSelect('deleteValue')}
        className={activeOption === 'deleteValue' ? 'active' : ''}
      >
        Delete Values
      </button>
    </div>
  );
};

export default GsocSidebar; 