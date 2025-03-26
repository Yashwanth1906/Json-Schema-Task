import React from 'react';
import { Record } from './types';

interface RecordsTableProps {
  records: Record[];
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records }) => {
  if (records.length === 0) return null;

  return (
    <div className="records-section">
      <h2>Document Records</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Certificate Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.name}</td>
              <td>{record.email}</td>
              <td>{record.isCertificateIssued}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable; 