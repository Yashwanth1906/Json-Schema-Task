import React from 'react';
import { TableStatus } from '../../types';

interface GsocInitTableProps {
  tableStatus: TableStatus;
  onInit: () => void;
  loading: boolean;
}

const GsocInitTable: React.FC<GsocInitTableProps> = ({
  tableStatus,
  onInit,
  loading
}) => {
  return (
    <div className="operation-form">
      <h2>Initialize GSOC Table</h2>
      <div className="table-status">
        <p className={tableStatus.isInitialized ? 'success' : 'warning'}>
          {tableStatus.message}
        </p>
        {!tableStatus.isInitialized && (
          <div className="init-actions">
            <p>Are you sure you want to initialize the table?</p>
            <button onClick={onInit} disabled={loading}>
              {loading ? 'Initializing...' : 'Yes, Initialize'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GsocInitTable; 