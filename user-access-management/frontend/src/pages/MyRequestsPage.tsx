import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface SoftwareDetails {
  id: number;
  name: string;
}

interface UserRequest {
  id: number;
  accessType: string;
  reason: string;
  status: string;
  software: SoftwareDetails;
  createdAt: string; // Add if you implement timestamps
  updatedAt: string; // Add if you implement timestamps
}

const MyRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get<UserRequest[]>('http://localhost:5000/api/requests/my-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
      } catch (err) {
        console.error('Error fetching my requests:', err);
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(axiosError.response?.data?.message || axiosError.message || 'Failed to fetch requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [navigate]);

  if (loading) {
    return <p>Loading your requests...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>My Software Access Requests</h2>
      {requests.length === 0 ? (
        <p>You have not submitted any requests yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Request ID</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Software Name</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Access Type</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Reason</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Submitted At</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Last Updated At</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{request.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{request.software.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{request.accessType}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{request.reason}</td>
                <td style={{
                  border: '1px solid #ddd', 
                  padding: '12px', 
                  fontWeight: 'bold', 
                  color: request.status === 'Approved' ? 'green' : request.status === 'Rejected' ? 'red' : '#E69500' // Darker orange for pending
                }}>
                  {request.status}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{new Date(request.createdAt).toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{new Date(request.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyRequestsPage;
