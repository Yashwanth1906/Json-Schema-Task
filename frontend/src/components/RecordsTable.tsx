import React from 'react';
import { GsocRecord } from './types';  

interface RecordsTableProps {
  records: GsocRecord[];
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records }) => {
  if (records.length > 0) {
    return (
      <div className="records-section">
        <h2>GSOC Records</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Certificate Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record : GsocRecord, index : number) => (
              <tr key={index}>
                <td>{record.username}</td>
                <td>{record.email}</td>
                <td>{record.isCertificateIssued}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default RecordsTable; 