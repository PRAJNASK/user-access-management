// PendingRequests.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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
      const response = await axios.get('http://localhost:5000/api/requests/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data || []);
      if (response.data.length === 0) {
        setMessage('No pending requests found.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setMessage('Failed to fetch pending requests. ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleUpdateRequest = async (requestId, newStatus) => {
    setLoading(true); // Use main loading state for simplicity, or create a specific one
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
      fetchPendingRequests(); // Refresh the list
      // setLoading(false); // fetchPendingRequests will set loading to false
    } catch (error) {
      console.error(`Error updating request ${requestId} to ${newStatus}:`, error);
      setMessage(
        `Failed to update request ${requestId}. ` +
        (error.response?.data?.message || error.message)
      );
      setLoading(false); // Ensure loading is false on error if fetchPendingRequests isn't called or also errors
    }
  };

  if (loading && requests.length === 0) { // Only show full page loading if requests are not yet loaded
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
                    disabled={loading} // Disable buttons during any loading state
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleUpdateRequest(request.id, 'Rejected')} 
                    disabled={loading} // Disable buttons during any loading state
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && !message && <p>No pending requests to display.</p>
      )}
    </div>
  );
}

export default PendingRequests;
