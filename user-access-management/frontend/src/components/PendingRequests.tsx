// filepath: c:\Users\PRAJNA SHETTY\user-access-management\user-access-management\frontend\src\components\PendingRequests.tsx
import React, { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  role: string;
}

interface Software {
  id: number;
  name: string;
  description?: string; // Optional, as it was in backend controller
}

interface Request {
  id: number;
  accessType: string;
  reason: string;
  status: string;
  user: User;
  software: Software;
  // Add other fields like createdAt, updatedAt if they are sent and used
}

const PendingRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please login.');
        navigate('/login');
        return;
      }
      const response = await axios.get<Request[]>('http://localhost:5000/api/requests/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data || []);
      if (response.data && response.data.length === 0) {
        setMessage('No pending requests found.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      setMessage('Failed to fetch pending requests. ' + (axiosError.response?.data?.message || axiosError.message));
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleUpdateRequest = async (requestId: number, newStatus: 'Approved' | 'Rejected') => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please login.');
        navigate('/login');
        setLoading(false);
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/requests/${requestId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(`Request ${requestId} has been ${newStatus.toLowerCase()}.`);
      fetchPendingRequests(); 
    } catch (error) {
      console.error(`Error updating request ${requestId} to ${newStatus}:`, error);
      const axiosError = error as AxiosError<{ message?: string }>;
      setMessage(
        `Failed to update request ${requestId}. ` +
        (axiosError.response?.data?.message || axiosError.message)
      );
      setLoading(false); 
    }
  };

  if (loading && requests.length === 0) { 
    return <p>Loading pending requests...</p>;
  }

  return (
    <div>
      <h2>Pending Software Access Requests</h2>
      {message && <p>{message}</p>}
      {requests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>User</th>
              <th>Software</th>
              <th>Access Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.user?.username || 'N/A'} ({request.user?.role || 'N/A'})</td>
                <td>{request.software?.name || 'N/A'}</td>
                <td>{request.accessType}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
                <td>
                  <button 
                    onClick={() => handleUpdateRequest(request.id, 'Approved')} 
                    disabled={loading} 
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleUpdateRequest(request.id, 'Rejected')} 
                    disabled={loading} 
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && message && <p>{message}</p> // Show message if there is one (e.g., "No pending requests")
      )}
      {!loading && !message && requests.length === 0 && <p>No pending requests to display.</p>}
    </div>
  );
};

export default PendingRequests;
