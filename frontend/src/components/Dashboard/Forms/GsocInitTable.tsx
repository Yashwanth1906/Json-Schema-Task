import React, { useEffect } from 'react';
import { BACKEND_URL } from '../../../config';
import axios from 'axios';

interface GsocInitTableProps {
  tableStatus: boolean;
  onInit: () => void;
  loading: boolean;
  setTableStatus : (status : boolean) => void;
}

const GsocInitTable: React.FC<GsocInitTableProps> = ({
  tableStatus,
  setTableStatus,
  onInit,
  loading
}) => {
  useEffect(()=>{
    const getTableInitStatus = async() =>{
      await axios.get(`${BACKEND_URL}/api/table/is-table-inited`)
      .then((res)=>{
        if(res.data.success) {
          if(res.data.tableInited) {
            setTableStatus(true);
          } else {
            setTableStatus(false);
          }
        } else {
          alert(res.data.error)
        }
      }).catch((error)=>{
        alert(error.message)
      })
    }
    getTableInitStatus();
  },[tableStatus])
  return (
    <div className="operation-form">
      <h2>Initialize GSOC Table</h2>
      <div className="table-status">
        {!tableStatus ? (
          <div className="init-actions">
            <p>Are you sure you want to initialize the table?</p>
            <button onClick={onInit} disabled={loading}>
              {loading ? 'Initializing...' : 'Yes, Initialize'}
            </button>
          </div>
        ) : (
          <div>
            <h2>You have already initialized the table in your document!!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default GsocInitTable; 