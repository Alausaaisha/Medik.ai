import React from 'react';
import { Link } from 'react-router-dom';
import './History.css';

const History = () => {
  const historyData = [
    { date: '21/08/2024', patientName: 'Guy Hawkins', pcos: true },
    { date: '01/08/2024', patientName: 'Guy Hawkins', pcos: true },
    { date: '16/05/2024', patientName: 'Guy Hawkins', pcos: false },
    { date: '01/01/2023', patientName: 'Guy Hawkins', pcos: false },
  ];

  return (
    <div className="main-content p-4 flex-grow-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>History</h4>
        <div className="user-info d-flex align-items-center">
          <span className="mr-2">Aisha Alausa</span>
          <img src="user-avatar-url" alt="User Avatar" className="rounded-circle" width="40" height="40" />
        </div>
      </div>
      <div className="history-table bg-light p-4">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient Name</th>
              <th>PCOS</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.patientName}</td>
                <td>
                  {record.pcos ? (
                    <span className="text-success">&#10003; YES</span>
                  ) : (
                    <span className="text-danger">&#10007; YES</span>
                  )}
                </td>
                <td>
                  <Link to="#" className="text-primary">
                    Download result copy
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
