import React from 'react';
import { DashboardOption } from '../types';

interface SidebarProps {
  onOptionSelect: (option: DashboardOption) => void;
  activeOption: DashboardOption;
}

const Sidebar: React.FC<SidebarProps> = ({ onOptionSelect, activeOption }) => {
  return (
    <div className="sidebar">
      <h3>Document Operations</h3>
      <button 
        onClick={() => onOptionSelect('newEntry')}
        className={activeOption === 'newEntry' ? 'active' : ''}
      >
        New Entry
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
        Delete Value
      </button>
    </div>
  );
};

export default Sidebar; 