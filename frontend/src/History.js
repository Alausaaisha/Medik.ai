// import React, { useEffect, useState } from 'react';
// import './History.css';
// import { useAuth } from './AuthContext'; // Assuming you're using a custom AuthContext for user info

// const History = () => {
//   const [historyData, setHistoryData] = useState([]);
//   const { isAuthenticated } = useAuth(); // Fetch authentication state

//   useEffect(() => {
//     // Fetch history data from the backend
//     const fetchHistoryData = async () => {
//       try {
//         // Get userId from sessionStorage
//         const userId = sessionStorage.getItem('userId');

//         if (!userId) {
//           console.error('User is not authenticated');
//           return;
//         }

//         const response = await fetch('http://127.0.0.1:5000/history', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             // Use the userId or token from sessionStorage for authentication
//             Authorization: `Bearer ${userId}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setHistoryData(data.history);
//         } else {
//           console.error('Error fetching history data');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     if (isAuthenticated) {
//       fetchHistoryData();
//     }
//   }, [isAuthenticated]);

//   return (
//     <div className="history-page">
//       <div className="sidebar">
//         <ul>
//           <li><a href="/scans">Scans</a></li>
//           <li className="active"><a href="/history">History</a></li>
//           <li><a href="/profile">Profile</a></li>
//           <li><a href="/logout">Log out</a></li>
//         </ul>
//       </div>
//       <div className="main-content">
//         <header className="d-flex justify-content-between align-items-center">
//           <h4>History</h4>
//           <div className="user-info">
//             {user && <span>{user.fullName}</span>}
//             <img src="user-avatar-url" alt="User Avatar" className="user-avatar" />
//           </div>
//         </header>

//         <div className="history-table">
//           <table>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Patient Name</th>
//                 <th>PCOS</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {historyData.map((record) => (
//                 <tr key={record.id}>
//                   <td>{record.date}</td>
//                   <td>{record.patientName}</td>
//                   <td>
//                     {record.pcos === 'YES' ? (
//                       <span className="pcos-yes">&#10003; YES</span>
//                     ) : (
//                       <span className="pcos-no">&#10007; NO</span>
//                     )}
//                   </td>
//                   <td>
//                     <a href={record.downloadLink} className="download-link">Download result copy</a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;

import React, { useEffect, useState } from 'react';
import './History.css';
import { useAuth } from './AuthContext';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const { user } = useAuth(); // Fetch user info

  useEffect(() => {
    // Fetch history data from the backend
    const fetchHistoryData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHistoryData(data.history);
        } else {
          console.error('Error fetching history data:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchHistoryData(); // Fetch data on component mount
  }, []);

  return (
    <div className="history-page">
      <div className="main-content">
        <header className="d-flex justify-content-between align-items-center">
          <h4>History</h4>
          <div className="user-info">
            {user && <span>{user.fullName}</span>}
            <img src="user-avatar-url" alt="User Avatar" className="user-avatar" />
          </div>
        </header>

        <div className="history-table">
          {historyData.length > 0 ? (
            <table>
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
                      {record.pcos === 'YES' ? (
                        <span className="pcos-yes">&#10003; YES</span>
                      ) : (
                        <span className="pcos-no">&#10007; NO</span>
                      )}
                    </td>
                    <td>
                      <a href={record.downloadLink} className="download-link">Download result copy</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No history data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
